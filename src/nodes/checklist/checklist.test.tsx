import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ChecklistNode, type ChecklistData } from "./checklist"

const items = [
  { id: "a", text: "Buy milk", done: false },
  { id: "b", text: "Call Ana", done: true },
]

function renderNode(data: ChecklistData, editing = false) {
  const updateData = vi.fn()
  render(
    <ChecklistNode
      id="1"
      data={data}
      width={240}
      height={240}
      selected={false}
      editing={editing}
      updateData={updateData}
      stopEditing={vi.fn()}
    />,
  )
  return updateData
}

describe("ChecklistNode", () => {
  it("shows the title and the items", () => {
    renderNode({ title: "Today", items })
    expect(screen.getByRole("textbox")).toHaveTextContent("Today")
    expect(screen.getByText("Buy milk")).toBeInTheDocument()
    expect(screen.getAllByRole("checkbox")).toHaveLength(2)
  })

  it("shows a done item with a line through it", () => {
    renderNode({ title: "", items })
    expect(screen.getByText("Call Ana")).toHaveClass("line-through")
    expect(screen.getByText("Buy milk")).not.toHaveClass("line-through")
  })

  it("ticks an item", () => {
    const updateData = renderNode({ title: "", items })
    fireEvent.click(screen.getByRole("checkbox", { name: "Buy milk" }))
    expect(updateData).toHaveBeenCalledWith({ items: [{ ...items[0], done: true }, items[1]] })
  })

  it("works with old data that has no items", () => {
    renderNode({ title: "Old" })
    expect(screen.getByText("Double-click to add items")).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "No items" })).toBeDisabled()
  })

  it("shows a check box and a hint for a new empty item", () => {
    renderNode({ title: "", items: [{ id: "first", text: "", done: false }] })
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
    expect(screen.getByText("New item")).toBeInTheDocument()
  })

  it("adds an item in the edit state", () => {
    const updateData = renderNode({ title: "", items }, true)
    fireEvent.click(screen.getByRole("button", { name: "Add item" }))
    const next = updateData.mock.calls[0][0].items
    expect(next).toHaveLength(3)
    expect(next[2]).toMatchObject({ text: "", done: false })
  })

  it("edits the text of an item", () => {
    const updateData = renderNode({ title: "", items }, true)
    fireEvent.change(screen.getAllByRole("textbox", { name: "Item text" })[0], {
      target: { value: "Buy bread" },
    })
    expect(updateData).toHaveBeenCalledWith({ items: [{ ...items[0], text: "Buy bread" }, items[1]] })
  })

  it("deletes an item", () => {
    const updateData = renderNode({ title: "", items }, true)
    fireEvent.click(screen.getAllByRole("button", { name: "Delete item" })[0])
    expect(updateData).toHaveBeenCalledWith({ items: [items[1]] })
  })
})
