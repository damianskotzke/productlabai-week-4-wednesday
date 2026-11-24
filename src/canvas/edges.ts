import { anchors, elbowPoints } from "./geometry"
import type { BoardEdge, BoardNode, Point } from "./types"

/** The corner points of a connector, or `null` when one of its nodes is gone. */
export function edgePoints(edge: BoardEdge, nodes: Record<string, BoardNode>): Point[] | null {
  const source = nodes[edge.source]
  const target = nodes[edge.target]
  if (!source || !target) return null
  const { start, end } = anchors(source, target)
  return elbowPoints(start, end)
}

/** The corner points of the connector that the user draws now. */
export function draftPoints(source: BoardNode, to: Point): Point[] {
  const { start } = anchors(source, { x: to.x, y: to.y, width: 0, height: 0 })
  return elbowPoints(start, to)
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared
  const clamped = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (a.x + clamped * dx), p.y - (a.y + clamped * dy))
}

/** The id of the connector within `tolerance` of the world point, if there is one. */
export function hitTestEdge(
  edges: Record<string, BoardEdge>,
  nodes: Record<string, BoardNode>,
  world: Point,
  tolerance: number,
): string | null {
  for (const edge of Object.values(edges)) {
    const points = edgePoints(edge, nodes)
    if (!points) continue
    for (let i = 0; i < points.length - 1; i++) {
      if (distanceToSegment(world, points[i], points[i + 1]) <= tolerance) return edge.id
    }
  }
  return null
}
