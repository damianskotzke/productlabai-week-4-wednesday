import { Component, memo, useRef, type ReactNode } from "react"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import type { Point, Side } from "@/canvas/types"
import { cn } from "@/lib/utils"
import { getNodeDefinition } from "@/nodes/registry"
import { NodeDecorations } from "./node-decorations"

/**
 * The frame around each node on the board.
 *
 * The shell gives every node type the same behaviour: position, selection,
 * the four connection dots, the resize grip, reactions and tags.
 * The node component draws only the content.
 */

const HANDLES: Array<{ side: Side; className: string }> = [
  { side: "top", className: "left-1/2 -top-[7.5px] -translate-x-1/2" },
  { side: "right", className: "top-1/2 -right-[7.5px] -translate-y-1/2" },
  { side: "bottom", className: "left-1/2 -bottom-[7.5px] -translate-x-1/2" },
  { side: "left", className: "top-1/2 -left-[7.5px] -translate-y-1/2" },
]

/** The eight directions: left, right, up, down and the four diagonals. */
const FLEE_DIRECTIONS: Point[] = [-1, 0, 1]
  .flatMap((x) => [-1, 0, 1].map((y) => ({ x, y })))
  .filter((direction) => direction.x !== 0 || direction.y !== 0)

/** How far a clicked node runs away: one of its widths, in a random direction. */
function fleeOffset(width: number, random: () => number = Math.random): Point {
  const direction = FLEE_DIRECTIONS[Math.floor(random() * FLEE_DIRECTIONS.length)]
  return { x: direction.x * width, y: direction.y * width }
}

/** Move a clicked node away from the mouse and save the new position. */
function useFleeOnClick(id: string) {
  const pressedAt = useRef<Point | null>(null)

  const onPointerDown = () => {
    const node = useBoardStore.getState().nodes[id]
    pressedAt.current = node ? { x: node.x, y: node.y } : null
  }

  const onClick = (event: React.MouseEvent) => {
    const start = pressedAt.current
    pressedAt.current = null
    const state = useBoardStore.getState()
    const node = state.nodes[id]
    if (!node || !start || state.editingId === id || state.tool !== SELECT_TOOL) return
    // The connection dots and the resize grip keep their normal job.
    if ((event.target as Element).closest("[data-handle], [data-resize]")) return
    // A drag also ends with a click. Only a click without a move makes the node run away.
    if (node.x !== start.x || node.y !== start.y) return
    const offset = fleeOffset(node.width)
    state.patchNode(id, { x: node.x + offset.x, y: node.y + offset.y })
    state.commitNode(id)
  }

  return { onPointerDown, onClick }
}

const NodeShell = memo(function NodeShell({ id, rank }: { id: string; rank: number }) {
  const flee = useFleeOnClick(id)
  const node = useBoardStore((state) => state.nodes[id])
  const selected = useBoardStore((state) => state.selection?.kind === "node" && state.selection.id === id)
  const editing = useBoardStore((state) => state.editingId === id)
  const isDropTarget = useBoardStore((state) => state.draft?.targetId === id)
  const linking = useBoardStore((state) => state.draft !== null)
  const selectTool = useBoardStore((state) => state.tool === SELECT_TOOL)
  const updateNodeData = useBoardStore((state) => state.updateNodeData)
  const setEditing = useBoardStore((state) => state.setEditing)

  if (!node) return null
  const definition = getNodeDefinition(node.type)
  const connectable = definition ? definition.connectable !== false : false
  const resizable = definition ? definition.resizable !== false : false
  const NodeComponent = definition?.component

  return (
    <div
      data-slot="node-shell"
      data-node-id={id}
      data-node-type={node.type}
      data-selected={selected || undefined}
      data-editing={editing || undefined}
      data-connectable={connectable || undefined}
      className={cn(
        "group/node pointer-events-auto absolute touch-none select-none",
        isDropTarget && "rounded-2xl outline-2 outline-offset-[6px] outline-selection outline-dashed",
      )}
      style={{ left: node.x, top: node.y, width: node.width, height: node.height, zIndex: rank }}
      onPointerDown={flee.onPointerDown}
      onClick={flee.onClick}
    >
      {NodeComponent ? (
        <NodeErrorBoundary type={node.type}>
          <NodeComponent
            id={id}
            data={node.data}
            width={node.width}
            height={node.height}
            selected={selected}
            editing={editing}
            updateData={(patch: Record<string, unknown>) => updateNodeData(id, patch)}
            stopEditing={() => setEditing(null)}
          />
        </NodeErrorBoundary>
      ) : (
        <NodeFallback title={`Unknown node: ${node.type}`}>
          Pull the latest <code>main</code> branch to see this node.
        </NodeFallback>
      )}

      <NodeDecorations reactions={node.data.reactions} tags={node.data.tags} />

      {connectable &&
        !editing &&
        HANDLES.map((handle) => (
          <span
            key={handle.side}
            data-handle={handle.side}
            className={cn(
              "absolute z-20 size-3 cursor-crosshair rounded-full border-[1.5px] border-selection bg-background",
              handle.className,
              linking || selected ? "block" : selectTool ? "hidden group-hover/node:block" : "hidden",
            )}
          />
        ))}

      {resizable && selected && !editing && (
        <span
          data-resize
          title="Drag to resize"
          className="absolute -right-2 -bottom-2 z-20 size-4 cursor-nwse-resize rounded-br-md border-r-2 border-b-2 border-selection"
        />
      )}
    </div>
  )
})

function NodeFallback({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      data-slot="node-fallback"
      className="flex size-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-muted p-3 text-center text-xs text-muted-foreground group-data-selected/node:border-selection"
    >
      <strong className="font-medium text-foreground">{title}</strong>
      <span>{children}</span>
    </div>
  )
}

/** One broken node must not break the board for all people. */
class NodeErrorBoundary extends Component<{ type: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error(`Node "${this.props.type}" failed to render`, error)
  }

  render() {
    if (this.state.error) {
      return (
        <NodeFallback title={`Node "${this.props.type}" has an error`}>
          {this.state.error.message}
        </NodeFallback>
      )
    }
    return this.props.children
  }
}

export { fleeOffset, NodeErrorBoundary, NodeFallback, NodeShell }
