import { beforeEach, describe, expect, it } from "vitest"
import { useGridStyle } from "./grid-style"

const KEY = "whiteboard:grid-style"

describe("grid style", () => {
  beforeEach(() => {
    localStorage.clear()
    useGridStyle.setState({ gridStyle: "dots" })
  })

  it("starts with dots", () => {
    expect(useGridStyle.getState().gridStyle).toBe("dots")
  })

  it("saves the choice in localStorage", () => {
    useGridStyle.getState().setGridStyle("lines")
    expect(JSON.parse(localStorage.getItem(KEY)!).state.gridStyle).toBe("lines")
  })

  it("loads a saved choice after a reload", async () => {
    localStorage.setItem(KEY, JSON.stringify({ state: { gridStyle: "none" }, version: 0 }))
    await useGridStyle.persist.rehydrate()
    expect(useGridStyle.getState().gridStyle).toBe("none")
  })

  it("ignores an unknown saved value", async () => {
    localStorage.setItem(KEY, JSON.stringify({ state: { gridStyle: "stars" }, version: 0 }))
    await useGridStyle.persist.rehydrate()
    expect(useGridStyle.getState().gridStyle).toBe("dots")
  })
})
