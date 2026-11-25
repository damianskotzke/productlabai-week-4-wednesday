import { describe, expect, it } from "vitest"
import { fleeOffset } from "./node-shell"

describe("fleeOffset", () => {
  it("moves the node one width away, also on a diagonal", () => {
    const offsets = Array.from({ length: 8 }, (_, index) => fleeOffset(100, () => index / 8))
    expect(offsets).toEqual([
      { x: -100, y: -100 },
      { x: -100, y: 0 },
      { x: -100, y: 100 },
      { x: 0, y: -100 },
      { x: 0, y: 100 },
      { x: 100, y: -100 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
    ])
  })

  it("never stays at the same place", () => {
    for (let index = 0; index < 100; index++) {
      const offset = fleeOffset(50)
      expect(offset.x !== 0 || offset.y !== 0).toBe(true)
    }
  })
})
