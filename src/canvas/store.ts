import { toast } from "sonner"
import { create } from "zustand"
import { repository } from "@/lib/board-repository"
import { getGithubUser } from "@/lib/identity"
import { getNodeDefinition } from "@/nodes/registry"
import { boundsOf, fitView, zoomAt } from "./geometry"
import type { BoardEdge, BoardNode, BoardSnapshot, Point, Selection, View } from "./types"

/**
 * The one store for the board: camera, nodes, connectors, selection, tool.
 *
 * Local actions change the state first and save to the repository after
 * (optimistic update). `applyRemote*` actions take changes from other people.
 */

export const SELECT_TOOL = "select"
const SAVE_DELAY = 400

export type BoardStatus = "loading" | "live" | "mock" | "error"

/** A connector that the user is drawing now. */
export type Draft = { sourceId: string; to: Point; targetId: string | null }

type BoardState = {
  status: BoardStatus
  title: string
  nodes: Record<string, BoardNode>
  edges: Record<string, BoardEdge>
  view: View
  viewport: { width: number; height: number }
  selection: Selection
  /** "select" or the `type` of the node that the next click creates. */
  tool: string
  editingId: string | null
  draft: Draft | null

  hydrate: (snapshot: BoardSnapshot, status: BoardStatus) => void
  setStatus: (status: BoardStatus) => void
  setViewport: (width: number, height: number) => void
  setView: (view: View) => void
  panBy: (dx: number, dy: number) => void
  zoomAtPoint: (screen: Point, factor: number) => void
  zoomToFit: () => void
  setTool: (tool: string) => void
  select: (selection: Selection) => void
  setEditing: (id: string | null) => void
  setDraft: (draft: Draft | null) => void
  setTitle: (title: string) => void

  addNode: (type: string, center: Point, data?: Record<string, unknown>) => string | null
  /** Change position or size during a gesture. Call `commitNode` at the end. */
  patchNode: (id: string, patch: Partial<Pick<BoardNode, "x" | "y" | "width" | "height">>) => void
  commitNode: (id: string) => void
  updateNodeData: (id: string, patch: Record<string, unknown>) => void
  bringToFront: (id: string) => void
  /** Turn a node into a different node type. Text with the same field name is kept. */
  changeNodeType: (id: string, type: string) => void
  removeNode: (id: string) => void
  addEdge: (source: string, target: string) => void
  updateEdge: (id: string, patch: Partial<Pick<BoardEdge, "dashed">>) => void
  removeEdge: (id: string) => void
  removeSelection: () => void

  applyRemoteNode: (node: BoardNode) => void
  applyRemoteNodeDeleted: (id: string) => void
  applyRemoteEdge: (edge: BoardEdge) => void
  applyRemoteEdgeDeleted: (id: string) => void
  applyRemoteTitle: (title: string) => void
}

// Nodes with a save that waits. Remote echoes for these nodes are ignored,
// or the text would jump back while a person types.
const pendingSaves = new Map<string, ReturnType<typeof setTimeout>>()
// Nodes that the local user moves or resizes now.
const busyNodes = new Set<string>()

function save(action: Promise<void>) {
  action.catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown error"
    toast.error("Could not save the change", { description: message })
  })
}

function without<T>(record: Record<string, T>, id: string): Record<string, T> {
  const next = { ...record }
  delete next[id]
  return next
}

export const useBoardStore = create<BoardState>((set, get) => ({
  status: "loading",
  title: "",
  nodes: {},
  edges: {},
  view: { x: 0, y: 0, scale: 1 },
  viewport: { width: 1280, height: 720 },
  selection: null,
  tool: SELECT_TOOL,
  editingId: null,
  draft: null,

  hydrate: (snapshot, status) =>
    set({
      status,
      title: snapshot.title,
      nodes: Object.fromEntries(snapshot.nodes.map((node) => [node.id, node])),
      edges: Object.fromEntries(snapshot.edges.map((edge) => [edge.id, edge])),
    }),
  setStatus: (status) => set({ status }),
  setViewport: (width, height) => set({ viewport: { width, height } }),
  setView: (view) => set({ view }),
  panBy: (dx, dy) => set(({ view }) => ({ view: { ...view, x: view.x + dx, y: view.y + dy } })),
  zoomAtPoint: (screen, factor) => set(({ view }) => ({ view: zoomAt(view, screen, factor) })),
  zoomToFit: () => {
    const bounds = boundsOf(Object.values(get().nodes))
    if (bounds) set({ view: fitView(bounds, get().viewport) })
  },
  setTool: (tool) => set({ tool, editingId: null }),
  select: (selection) => set({ selection }),
  setEditing: (editingId) => set({ editingId }),
  setDraft: (draft) => set({ draft }),
  setTitle: (title) => {
    const next = title.trim()
    if (!next || next === get().title) return
    set({ title: next })
    save(repository.setTitle(next))
  },

  addNode: (type, center, data) => {
    const definition = getNodeDefinition(type)
    if (!definition) return null
    const { width, height } = definition.defaultSize
    const node: BoardNode = {
      id: crypto.randomUUID(),
      type,
      x: Math.round(center.x - width / 2),
      y: Math.round(center.y - height / 2),
      width,
      height,
      z: Date.now(),
      data: { ...structuredClone(definition.defaultData), ...data },
      createdBy: getGithubUser(),
    }
    set(({ nodes }) => ({
      nodes: { ...nodes, [node.id]: node },
      selection: { kind: "node", id: node.id },
      tool: SELECT_TOOL,
      editingId: definition.editOnCreate ? node.id : null,
    }))
    save(repository.upsertNode(node))
    return node.id
  },

  patchNode: (id, patch) => {
    busyNodes.add(id)
    set(({ nodes }) => (nodes[id] ? { nodes: { ...nodes, [id]: { ...nodes[id], ...patch } } } : {}))
  },

  commitNode: (id) => {
    busyNodes.delete(id)
    const node = get().nodes[id]
    if (node) save(repository.upsertNode(node))
  },

  updateNodeData: (id, patch) => {
    const node = get().nodes[id]
    if (!node) return
    set(({ nodes }) => ({ nodes: { ...nodes, [id]: { ...node, data: { ...node.data, ...patch } } } }))
    clearTimeout(pendingSaves.get(id))
    pendingSaves.set(
      id,
      setTimeout(() => {
        pendingSaves.delete(id)
        const latest = get().nodes[id]
        if (latest) save(repository.upsertNode(latest))
      }, SAVE_DELAY),
    )
  },

  bringToFront: (id) => {
    const node = get().nodes[id]
    if (!node) return
    const top = Math.max(...Object.values(get().nodes).map((other) => other.z))
    if (node.z === top) return
    set(({ nodes }) => ({ nodes: { ...nodes, [id]: { ...node, z: Math.max(Date.now(), top + 1) } } }))
  },

  changeNodeType: (id, type) => {
    const node = get().nodes[id]
    const definition = getNodeDefinition(type)
    if (!node || !definition || node.type === type) return
    // Start from the default data of the new type. Keep the content: text
    // fields that both types have (for example `text`). Settings such as a
    // colour start again, because the new type can have different values.
    const data: BoardNode["data"] = structuredClone(definition.defaultData)
    for (const [key, fallback] of Object.entries(data)) {
      const previous = node.data[key]
      if (fallback === "" && typeof previous === "string") data[key] = previous
    }
    if (node.data.reactions) data.reactions = node.data.reactions
    if (node.data.tags) data.tags = node.data.tags
    // Keep the centre of the node at the same place.
    const { width, height } = definition.defaultSize
    const next: BoardNode = {
      ...node,
      type,
      data,
      width,
      height,
      x: Math.round(node.x + (node.width - width) / 2),
      y: Math.round(node.y + (node.height - height) / 2),
    }
    clearTimeout(pendingSaves.get(id))
    pendingSaves.delete(id)
    set(({ nodes }) => ({ nodes: { ...nodes, [id]: next }, editingId: null }))
    save(repository.upsertNode(next))
  },

  removeNode: (id) => {
    clearTimeout(pendingSaves.get(id))
    pendingSaves.delete(id)
    set(({ nodes, edges, selection, editingId }) => ({
      nodes: without(nodes, id),
      // The database removes these connectors too (on delete cascade).
      edges: Object.fromEntries(
        Object.entries(edges).filter(([, edge]) => edge.source !== id && edge.target !== id),
      ),
      selection: selection?.id === id ? null : selection,
      editingId: editingId === id ? null : editingId,
    }))
    save(repository.deleteNode(id))
  },

  addEdge: (source, target) => {
    if (source === target) return
    const exists = Object.values(get().edges).some(
      (edge) =>
        (edge.source === source && edge.target === target) ||
        (edge.source === target && edge.target === source),
    )
    if (exists) return
    const edge: BoardEdge = { id: crypto.randomUUID(), source, target, dashed: false }
    set(({ edges }) => ({ edges: { ...edges, [edge.id]: edge }, selection: { kind: "edge", id: edge.id } }))
    save(repository.upsertEdge(edge))
  },

  updateEdge: (id, patch) => {
    const edge = get().edges[id]
    if (!edge) return
    const next = { ...edge, ...patch }
    set(({ edges }) => ({ edges: { ...edges, [id]: next } }))
    save(repository.upsertEdge(next))
  },

  removeEdge: (id) => {
    set(({ edges, selection }) => ({
      edges: without(edges, id),
      selection: selection?.id === id ? null : selection,
    }))
    save(repository.deleteEdge(id))
  },

  removeSelection: () => {
    const { selection, removeNode, removeEdge } = get()
    if (selection?.kind === "node") removeNode(selection.id)
    if (selection?.kind === "edge") removeEdge(selection.id)
  },

  applyRemoteNode: (node) => {
    if (pendingSaves.has(node.id) || busyNodes.has(node.id)) return
    set(({ nodes }) => ({ nodes: { ...nodes, [node.id]: node } }))
  },
  applyRemoteNodeDeleted: (id) =>
    set(({ nodes, selection, editingId }) =>
      nodes[id]
        ? {
            nodes: without(nodes, id),
            selection: selection?.id === id ? null : selection,
            editingId: editingId === id ? null : editingId,
          }
        : {},
    ),
  applyRemoteEdge: (edge) => set(({ edges }) => ({ edges: { ...edges, [edge.id]: edge } })),
  applyRemoteEdgeDeleted: (id) =>
    set(({ edges, selection }) =>
      edges[id] ? { edges: without(edges, id), selection: selection?.id === id ? null : selection } : {},
    ),
  applyRemoteTitle: (title) => set({ title }),
}))
