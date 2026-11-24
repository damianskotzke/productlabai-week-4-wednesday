import { describe, expect, it } from "vitest"
import { hitTestEdge } from "./edges"
import {
  MAX_SCALE,
  MIN_SCALE,
  anchors,
  boundsOf,
  elbowPoints,
  fitView,
  toScreen,
  toWorld,
  tracePolyline,
  zoomAt,
} from "./geometry"
import type { BoardNode } from "./types"

const rect = (x: number, y: number, width = 100, height = 100) => ({ x, y, width, height })

describe("coordinates", () => {
  it("converts from screen to world and back", () => {
    const view = { x: 40, y: -20, scale: 2 }
    const world = toWorld(view, { x: 240, y: 180 })
    expect(world).toEqual({ x: 100, y: 100 })
    expect(toScreen(view, world)).toEqual({ x: 240, y: 180 })
  })
})

describe("zoomAt", () => {
  it("keeps the point below the cursor at the same place", () => {
    const view = { x: 10, y: 30, scale: 1 }
    const cursor = { x: 300, y: 200 }
    const before = toWorld(view, cursor)
    const after = toWorld(zoomAt(view, cursor, 1.5), cursor)
    expect(after.x).toBeCloseTo(before.x)
    expect(after.y).toBeCloseTo(before.y)
  })

  it("stays in the zoom limits", () => {
    const view = { x: 0, y: 0, scale: 1 }
    expect(zoomAt(view, { x: 0, y: 0 }, 100).scale).toBe(MAX_SCALE)
    expect(zoomAt(view, { x: 0, y: 0 }, 0.001).scale).toBe(MIN_SCALE)
  })
})

describe("fitView", () => {
  it("puts the bounds in the centre of the viewport", () => {
    const bounds = boundsOf([rect(0, 0), rect(900, 400)])!
    expect(bounds).toEqual({ x: 0, y: 0, width: 1000, height: 500 })
    const view = fitView(bounds, { width: 1000, height: 800 }, 0)
    expect(toScreen(view, { x: 500, y: 250 })).toEqual({ x: 500, y: 400 })
  })
})

describe("connectors", () => {
  it("leaves from the side that looks at the other node", () => {
    expect(anchors(rect(0, 0), rect(300, 20)).start.side).toBe("right")
    expect(anchors(rect(0, 0), rect(-300, 20)).start.side).toBe("left")
    expect(anchors(rect(0, 0), rect(20, 300)).start.side).toBe("bottom")
    expect(anchors(rect(0, 0), rect(20, -300)).end.side).toBe("bottom")
  })

  it("makes a straight line for nodes on the same level", () => {
    const { start, end } = anchors(rect(0, 0), rect(300, 0))
    expect(elbowPoints(start, end)).toEqual([
      { x: 100, y: 50 },
      { x: 300, y: 50 },
    ])
  })

  it("makes an elbow with two corners for nodes on different levels", () => {
    const { start, end } = anchors(rect(0, 0), rect(300, 100))
    expect(elbowPoints(start, end)).toEqual([
      { x: 100, y: 50 },
      { x: 200, y: 50 },
      { x: 200, y: 150 },
      { x: 300, y: 150 },
    ])
  })

  it("draws rounded corners", () => {
    const calls: string[] = []
    const path = {
      moveTo: () => calls.push("moveTo"),
      lineTo: () => calls.push("lineTo"),
      arcTo: () => calls.push("arcTo"),
    }
    tracePolyline(path, [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 50 },
    ])
    expect(calls).toEqual(["moveTo", "arcTo", "arcTo", "lineTo"])
  })

  it("finds the connector below the pointer", () => {
    const node = (id: string, x: number): BoardNode => ({
      id,
      type: "card",
      ...rect(x, 0),
      z: 0,
      data: {},
      createdBy: null,
    })
    const nodes = { a: node("a", 0), b: node("b", 300) }
    const edges = { e: { id: "e", source: "a", target: "b", dashed: false } }
    expect(hitTestEdge(edges, nodes, { x: 200, y: 53 }, 6)).toBe("e")
    expect(hitTestEdge(edges, nodes, { x: 200, y: 90 }, 6)).toBeNull()
  })
})
