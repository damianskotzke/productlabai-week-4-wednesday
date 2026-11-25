import { Component, memo, type ReactNode } from "react"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import type { Side } from "@/canvas/types"
import { cn } from "@/lib/utils"
import { getNodeDefinition } from "@/nodes/registry"
import { NodeAuthor, NodeDecorations } from "./node-decorations"

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

const NodeShell = memo(function NodeShell({ id, rank }: { id: string; rank: number }) {
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

      {node.createdBy && node.createdBy !== "Seed" && (
        <NodeAuthor user={node.createdBy} className="pointer-events-auto absolute -top-3 -left-3 z-10" />
      )}

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

export { NodeErrorBoundary, NodeFallback, NodeShell }
