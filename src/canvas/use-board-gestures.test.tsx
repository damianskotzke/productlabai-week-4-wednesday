import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useBoardStore } from "./store"
import { useBoardGestures } from "./use-board-gestures"

const store = () => useBoardStore.getState()

function doubleClickNode(id: string) {
  const board = document.createElement("div")
  const node = document.createElement("div")
  node.dataset.nodeId = id
  board.append(node)
  document.body.append(board)
  const { unmount } = renderHook(() => useBoardGestures({ current: board }))
  node.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }))
  unmount()
  board.remove()
}

describe("board gestures: double click", () => {
  beforeEach(() => {
    localStorage.clear()
    store().hydrate({ title: "Test", nodes: [], edges: [] }, "mock")
  })

  it("starts the edit state of a sticky note", () => {
    const id = store().addNode("sticky-note", { x: 0, y: 0 })!
    store().setEditing(null)
    doubleClickNode(id)
    expect(store().editingId).toBe(id)
  })

  it("does not start the edit state of an image", () => {
    const id = store().addNode("image", { x: 0, y: 0 })!
    doubleClickNode(id)
    expect(store().editingId).toBeNull()
  })
})
