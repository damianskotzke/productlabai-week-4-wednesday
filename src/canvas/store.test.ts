import { beforeEach, describe, expect, it } from "vitest"
import { useBoardStore } from "./store"

const store = () => useBoardStore.getState()

describe("board store", () => {
  beforeEach(() => {
    localStorage.clear()
    store().hydrate({ title: "Test", nodes: [], edges: [] }, "mock")
  })

  it("removes the connectors of a removed node", () => {
    const a = store().addNode("card", { x: 0, y: 0 })!
    const b = store().addNode("card", { x: 400, y: 0 })!
    store().addEdge(a, b)
    expect(Object.keys(store().edges)).toHaveLength(1)
    store().removeNode(a)
    expect(Object.keys(store().edges)).toHaveLength(0)
  })

  it("changes the node type and keeps the text and the centre", () => {
    const id = store().addNode("sticky-note", { x: 120, y: 120 }, { text: "Keep me", color: "purple" })!
    store().updateNodeData(id, { tags: [{ text: "Tag", x: 0.5, y: 0, rotation: 0 }] })
    store().changeNodeType(id, "card")
    const node = store().nodes[id]
    expect(node.type).toBe("card")
    expect(node.data.text).toBe("Keep me")
    // A colour is a setting: the card starts with its own default.
    expect(node.data.color).toBe("white")
    expect(node.data.tags).toHaveLength(1)
    expect({ width: node.width, height: node.height }).toEqual({ width: 240, height: 150 })
    expect({ x: node.x + node.width / 2, y: node.y + node.height / 2 }).toEqual({ x: 120, y: 120 })
  })

  it("ignores a node type that does not exist", () => {
    const id = store().addNode("text", { x: 0, y: 0 })!
    store().changeNodeType(id, "no-such-node")
    expect(store().nodes[id].type).toBe("text")
  })
})
