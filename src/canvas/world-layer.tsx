import { useShallow } from "zustand/react/shallow"
import { NodeShell } from "@/components/board/node-shell"
import { useBoardStore } from "./store"

/**
 * The layer that holds the nodes as HTML elements.
 * One CSS transform moves and zooms all nodes together.
 */
export function WorldLayer() {
  const view = useBoardStore((state) => state.view)
  // Node ids from back to front.
  const ids = useBoardStore(
    useShallow((state) =>
      Object.values(state.nodes)
        .sort((a, b) => a.z - b.z)
        .map((node) => node.id),
    ),
  )

  return (
    <div
      data-slot="world-layer"
      className="pointer-events-none absolute top-0 left-0 size-0 origin-top-left"
      style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
    >
      {ids.map((id, index) => (
        <NodeShell key={id} id={id} rank={index} />
      ))}
    </div>
  )
}
