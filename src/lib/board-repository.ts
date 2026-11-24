import type { BoardEdge, BoardNode, BoardSnapshot } from "@/canvas/types"
import seed from "../../supabase/seed-board.json"
import { BOARD_ID, supabase } from "./supabase"

/** Changes that other people made. The store applies them. */
export type RemoteHandlers = {
  onNode: (node: BoardNode) => void
  onNodeDeleted: (id: string) => void
  onEdge: (edge: BoardEdge) => void
  onEdgeDeleted: (id: string) => void
  onTitle: (title: string) => void
}

/** Where the board data lives. There are two versions: Supabase and mock. */
export interface BoardRepository {
  mode: "live" | "mock"
  load(): Promise<BoardSnapshot>
  upsertNode(node: BoardNode): Promise<void>
  deleteNode(id: string): Promise<void>
  upsertEdge(edge: BoardEdge): Promise<void>
  deleteEdge(id: string): Promise<void>
  setTitle(title: string): Promise<void>
  subscribe(handlers: RemoteHandlers): () => void
}

export const seedBoard = seed as BoardSnapshot

// ---------------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------------

type NodeRow = {
  id: string
  board_id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  z_index: number
  data: BoardNode["data"]
  created_by: string | null
}

type EdgeRow = {
  id: string
  board_id: string
  source_id: string
  target_id: string
  data: { dashed?: boolean } | null
}

const nodeFromRow = (row: NodeRow): BoardNode => ({
  id: row.id,
  type: row.type,
  x: row.x,
  y: row.y,
  width: row.width,
  height: row.height,
  z: row.z_index,
  data: row.data ?? {},
  createdBy: row.created_by,
})

const nodeToRow = (node: BoardNode): NodeRow => ({
  id: node.id,
  board_id: BOARD_ID,
  type: node.type,
  x: node.x,
  y: node.y,
  width: node.width,
  height: node.height,
  z_index: node.z,
  data: node.data,
  created_by: node.createdBy,
})

const edgeFromRow = (row: EdgeRow): BoardEdge => ({
  id: row.id,
  source: row.source_id,
  target: row.target_id,
  dashed: Boolean(row.data?.dashed),
})

const edgeToRow = (edge: BoardEdge): EdgeRow => ({
  id: edge.id,
  board_id: BOARD_ID,
  source_id: edge.source,
  target_id: edge.target,
  data: { dashed: edge.dashed },
})

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

function createSupabaseRepository(client: NonNullable<typeof supabase>): BoardRepository {
  return {
    mode: "live",

    async load() {
      const [board, nodes, edges] = await Promise.all([
        client.from("wb_boards").select("title").eq("id", BOARD_ID).maybeSingle(),
        client.from("wb_nodes").select("*").eq("board_id", BOARD_ID),
        client.from("wb_edges").select("*").eq("board_id", BOARD_ID),
      ])
      check(board.error)
      check(nodes.error)
      check(edges.error)
      return {
        title: board.data?.title ?? "Untitled board",
        nodes: (nodes.data as NodeRow[]).map(nodeFromRow),
        edges: (edges.data as EdgeRow[]).map(edgeFromRow),
      }
    },

    async upsertNode(node) {
      check((await client.from("wb_nodes").upsert(nodeToRow(node))).error)
    },
    async deleteNode(id) {
      check((await client.from("wb_nodes").delete().eq("id", id)).error)
    },
    async upsertEdge(edge) {
      check((await client.from("wb_edges").upsert(edgeToRow(edge))).error)
    },
    async deleteEdge(id) {
      check((await client.from("wb_edges").delete().eq("id", id)).error)
    },
    async setTitle(title) {
      check((await client.from("wb_boards").update({ title }).eq("id", BOARD_ID)).error)
    },

    subscribe(handlers) {
      const filter = `board_id=eq.${BOARD_ID}`
      const channel = client
        .channel(`board:${BOARD_ID}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "wb_nodes", filter }, (change) => {
          if (change.eventType === "DELETE") handlers.onNodeDeleted((change.old as NodeRow).id)
          else handlers.onNode(nodeFromRow(change.new as NodeRow))
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "wb_edges", filter }, (change) => {
          if (change.eventType === "DELETE") handlers.onEdgeDeleted((change.old as EdgeRow).id)
          else handlers.onEdge(edgeFromRow(change.new as EdgeRow))
        })
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "wb_boards", filter: `id=eq.${BOARD_ID}` },
          (change) => handlers.onTitle((change.new as { title: string }).title),
        )
        .subscribe()
      return () => {
        void client.removeChannel(channel)
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Mock mode: localStorage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "wb:board:v1"

function createLocalRepository(): BoardRepository {
  const read = (): BoardSnapshot => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as BoardSnapshot
    } catch {
      // Unreadable data: start again from the seed board.
    }
    return structuredClone(seedBoard)
  }
  const write = (change: (board: BoardSnapshot) => void) => {
    const board = read()
    change(board)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
    } catch {
      // Storage is full or blocked. The board still works until a reload.
    }
  }
  const put = <T extends { id: string }>(list: T[], item: T) => {
    const index = list.findIndex((entry) => entry.id === item.id)
    if (index === -1) list.push(item)
    else list[index] = item
  }

  return {
    mode: "mock",
    async load() {
      return read()
    },
    async upsertNode(node) {
      write((board) => put(board.nodes, node))
    },
    async deleteNode(id) {
      write((board) => {
        board.nodes = board.nodes.filter((node) => node.id !== id)
        board.edges = board.edges.filter((edge) => edge.source !== id && edge.target !== id)
      })
    },
    async upsertEdge(edge) {
      write((board) => put(board.edges, edge))
    },
    async deleteEdge(id) {
      write((board) => {
        board.edges = board.edges.filter((edge) => edge.id !== id)
      })
    },
    async setTitle(title) {
      write((board) => {
        board.title = title
      })
    },
    subscribe() {
      return () => {}
    },
  }
}

export const repository: BoardRepository = supabase
  ? createSupabaseRepository(supabase)
  : createLocalRepository()
