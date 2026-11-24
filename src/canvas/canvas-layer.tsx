import { useEffect, useRef } from "react"
import { draftPoints, edgePoints } from "./edges"
import { GRID_SIZE, tracePolyline } from "./geometry"
import { useBoardStore } from "./store"

/**
 * The <canvas> element below the nodes.
 * It draws the dotted grid and the connectors with the 2D context.
 * It does not use React state: it draws again when the store changes.
 */
export function CanvasLayer() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    // Colours come from the theme tokens in `src/index.css`.
    const styles = getComputedStyle(document.documentElement)
    const token = (name: string) => styles.getPropertyValue(name).trim()
    const colors = {
      dot: token("--grid-dot"),
      edge: token("--edge"),
      dashed: token("--edge-dashed"),
      selected: token("--selection"),
    }

    let frame = 0

    const draw = () => {
      frame = 0
      const { view, viewport, nodes, edges, selection, draft } = useBoardStore.getState()
      const ratio = window.devicePixelRatio || 1
      const width = Math.round(viewport.width * ratio)
      const height = Math.round(viewport.height * ratio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      // 1. Grid, in screen pixels.
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, viewport.width, viewport.height)
      let step = GRID_SIZE * view.scale
      while (step < 12) step *= 2
      const dot = Math.max(1, Math.min(2, 1.5 * view.scale))
      const startX = ((view.x % step) + step) % step
      const startY = ((view.y % step) + step) % step
      context.fillStyle = colors.dot
      context.beginPath()
      for (let x = startX; x < viewport.width; x += step) {
        for (let y = startY; y < viewport.height; y += step) {
          context.rect(x - dot / 2, y - dot / 2, dot, dot)
        }
      }
      context.fill()

      // 2. Connectors, in world units.
      context.setTransform(ratio * view.scale, 0, 0, ratio * view.scale, ratio * view.x, ratio * view.y)
      const thin = Math.max(1, 1 / view.scale)
      context.lineCap = "round"
      for (const edge of Object.values(edges)) {
        const points = edgePoints(edge, nodes)
        if (!points) continue
        const isSelected = selection?.kind === "edge" && selection.id === edge.id
        const path = new Path2D()
        tracePolyline(path, points)
        context.setLineDash(edge.dashed ? [4, 4] : [])
        context.lineWidth = isSelected ? thin * 1.5 : thin
        context.strokeStyle = isSelected ? colors.selected : edge.dashed ? colors.dashed : colors.edge
        context.stroke(path)
      }

      // 3. The connector that the user draws now.
      const source = draft ? nodes[draft.sourceId] : null
      if (draft && source) {
        const path = new Path2D()
        tracePolyline(path, draftPoints(source, draft.to))
        context.setLineDash([4, 4])
        context.lineWidth = thin * 1.5
        context.strokeStyle = colors.selected
        context.stroke(path)
      }
      context.setLineDash([])
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const unsubscribe = useBoardStore.subscribe(schedule)
    window.addEventListener("resize", schedule)
    schedule()

    return () => {
      unsubscribe()
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={ref} data-slot="canvas-layer" className="absolute inset-0 size-full" />
}
