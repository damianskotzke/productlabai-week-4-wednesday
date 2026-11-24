import type { Point, Rect, Side, View } from "./types"

/**
 * Pure math for the board. No React and no DOM in this file,
 * so each function is easy to test.
 */

export const MIN_SCALE = 0.15
export const MAX_SCALE = 3
export const GRID_SIZE = 24

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

/** Convert a screen point (relative to the board viewport) to a world point. */
export function toWorld(view: View, screen: Point): Point {
  return { x: (screen.x - view.x) / view.scale, y: (screen.y - view.y) / view.scale }
}

/** Convert a world point to a screen point (relative to the board viewport). */
export function toScreen(view: View, world: Point): Point {
  return { x: world.x * view.scale + view.x, y: world.y * view.scale + view.y }
}

/** Zoom by `factor` and keep the world point below `screen` at the same place. */
export function zoomAt(view: View, screen: Point, factor: number): View {
  const scale = clampScale(view.scale * factor)
  const world = toWorld(view, screen)
  return { scale, x: screen.x - world.x * scale, y: screen.y - world.y * scale }
}

/** The smallest rectangle that contains all the given rectangles. */
export function boundsOf(rects: Rect[]): Rect | null {
  if (rects.length === 0) return null
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  for (const r of rects) {
    left = Math.min(left, r.x)
    top = Math.min(top, r.y)
    right = Math.max(right, r.x + r.width)
    bottom = Math.max(bottom, r.y + r.height)
  }
  return { x: left, y: top, width: right - left, height: bottom - top }
}

/** A view that shows `bounds` in the centre of a viewport of the given size. */
export function fitView(
  bounds: Rect,
  viewport: { width: number; height: number },
  padding = 80,
  maxScale = 1,
): View {
  const scaleX = (viewport.width - padding * 2) / Math.max(bounds.width, 1)
  const scaleY = (viewport.height - padding * 2) / Math.max(bounds.height, 1)
  const scale = clampScale(Math.min(scaleX, scaleY, maxScale))
  return {
    scale,
    x: viewport.width / 2 - (bounds.x + bounds.width / 2) * scale,
    y: viewport.height / 2 - (bounds.y + bounds.height / 2) * scale,
  }
}

export function centerOf(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
}

/** The middle point of one side of a rectangle. */
export function sidePoint(rect: Rect, side: Side): Point {
  const c = centerOf(rect)
  switch (side) {
    case "top":
      return { x: c.x, y: rect.y }
    case "bottom":
      return { x: c.x, y: rect.y + rect.height }
    case "left":
      return { x: rect.x, y: c.y }
    case "right":
      return { x: rect.x + rect.width, y: c.y }
  }
}

export type Anchor = Point & { side: Side }

/**
 * Choose the two sides that a connector uses.
 * A connector leaves along the axis where the two nodes are farther apart.
 */
export function anchors(from: Rect, to: Rect): { start: Anchor; end: Anchor } {
  const a = centerOf(from)
  const b = centerOf(to)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const horizontal = Math.abs(dx) >= Math.abs(dy)
  const startSide: Side = horizontal ? (dx >= 0 ? "right" : "left") : dy >= 0 ? "bottom" : "top"
  const endSide: Side = horizontal ? (dx >= 0 ? "left" : "right") : dy >= 0 ? "top" : "bottom"
  return {
    start: { ...sidePoint(from, startSide), side: startSide },
    end: { ...sidePoint(to, endSide), side: endSide },
  }
}

/**
 * The corner points of an elbow connector: a line with right angles.
 * A straight connector gives two points. A bent connector gives four.
 */
export function elbowPoints(start: Anchor, end: Point): Point[] {
  const horizontal = start.side === "left" || start.side === "right"
  if (horizontal) {
    if (Math.abs(start.y - end.y) < 0.5) return [start, end].map(strip)
    const midX = (start.x + end.x) / 2
    return [strip(start), { x: midX, y: start.y }, { x: midX, y: end.y }, strip(end)]
  }
  if (Math.abs(start.x - end.x) < 0.5) return [start, end].map(strip)
  const midY = (start.y + end.y) / 2
  return [strip(start), { x: start.x, y: midY }, { x: end.x, y: midY }, strip(end)]
}

function strip(p: Point): Point {
  return { x: p.x, y: p.y }
}

/** The part of the 2D canvas API that `tracePolyline` needs. `Path2D` fits. */
export type PathSink = {
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
}

/** Draw a line through `points` with rounded corners. */
export function tracePolyline(path: PathSink, points: Point[], radius = 8): void {
  if (points.length === 0) return
  path.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const corner = points[i]
    const next = points[i + 1]
    const room = Math.min(distance(prev, corner), distance(corner, next)) / 2
    path.arcTo(corner.x, corner.y, next.x, next.y, Math.min(radius, room))
  }
  const last = points[points.length - 1]
  path.lineTo(last.x, last.y)
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
