import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useBoardStore } from "@/canvas/store"
import { useBoardClipboard } from "./use-board-clipboard"

const store = () => useBoardStore.getState()

function clipboardEvent(type: "copy" | "paste", text?: string) {
  const clipboardData = new DataTransfer()
  if (text !== undefined) clipboardData.setData("text/plain", text)
  const event = new ClipboardEvent(type, { clipboardData, bubbles: true, cancelable: true })
  document.body.dispatchEvent(event)
  return { event, clipboardData }
}

function setup() {
  const board = document.createElement("div")
  document.body.append(board)
  renderHook(() => useBoardClipboard({ current: board }))
  return board
}

describe("board clipboard", () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ""
    store().hydrate({ title: "Test", nodes: [], edges: [] }, "mock")
    store().setView({ x: 0, y: 0, scale: 1 })
    store().setViewport(800, 600)
  })

  it("copies the text of the selected node", () => {
    setup()
    store().addNode("sticky-note", { x: 0, y: 0 }, { text: "Copy me" })
    const { event, clipboardData } = clipboardEvent("copy")
    expect(event.defaultPrevented).toBe(true)
    expect(clipboardData.getData("text/plain")).toBe("Copy me")
  })

  it("pastes a copy of the copied node, moved a bit, without its reactions", () => {
    setup()
    const id = store().addNode(
      "sticky-note",
      { x: 100, y: 100 },
      {
        text: "Copy me",
        color: "blue",
        reactions: [{ kind: "star", x: 0.5, y: 0.5, rotation: 0 }],
      },
    )!
    store().patchNode(id, { width: 300, height: 200 })
    store().commitNode(id)
    clipboardEvent("copy")
    clipboardEvent("paste", "Copy me")

    const nodes = Object.values(store().nodes)
    expect(nodes).toHaveLength(2)
    const original = store().nodes[id]
    const copy = nodes.find((node) => node.id !== id)!
    expect(copy.data.text).toBe("Copy me")
    expect(copy.data.color).toBe("blue")
    expect(copy.data.reactions).toBeUndefined()
    expect({ width: copy.width, height: copy.height }).toEqual({ width: 300, height: 200 })
    expect({ x: copy.x - original.x, y: copy.y - original.y }).toEqual({ x: 24, y: 24 })
    expect(store().selection).toEqual({ kind: "node", id: copy.id })
    expect(store().editingId).toBeNull()
  })

  it("makes a sticky note in the middle of the view from other text", () => {
    setup()
    const { event } = clipboardEvent("paste", "  Hello from another app  ")
    expect(event.defaultPrevented).toBe(true)
    const [node] = Object.values(store().nodes)
    expect(node.type).toBe("sticky-note")
    expect(node.data.text).toBe("Hello from another app")
    expect({ x: node.x + node.width / 2, y: node.y + node.height / 2 }).toEqual({ x: 400, y: 300 })
    expect(store().editingId).toBeNull()
  })

  it("does nothing while the person types in a text field", () => {
    const board = setup()
    const field = document.createElement("textarea")
    board.append(field)
    const clipboardData = new DataTransfer()
    clipboardData.setData("text/plain", "Typed text")
    const event = new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true })
    field.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(Object.values(store().nodes)).toHaveLength(0)
  })

  it("ignores an empty paste", () => {
    setup()
    const { event } = clipboardEvent("paste", "   ")
    expect(event.defaultPrevented).toBe(false)
    expect(Object.values(store().nodes)).toHaveLength(0)
  })
})
