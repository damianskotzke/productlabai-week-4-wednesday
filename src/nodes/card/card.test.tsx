import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FlowCardNode, type FlowCardData } from "./card"

function renderCard(data: FlowCardData, { editing = false, updateData = vi.fn() } = {}) {
  return render(
    <FlowCardNode
      id="1"
      data={data}
      width={240}
      height={150}
      selected={false}
      editing={editing}
      updateData={updateData}
      stopEditing={vi.fn()}
    />,
  )
}

describe("FlowCardNode", () => {
  it("shows only the title for an old card without a subtitle", () => {
    renderCard({ text: "Plan", color: "white" })
    expect(screen.getAllByRole("textbox")).toHaveLength(1)
    expect(screen.getByRole("textbox")).toHaveTextContent("Plan")
  })

  it("shows the saved subtitle below the title", () => {
    renderCard({ text: "Plan", color: "blue", subtitle: "Week 1" })
    const [title, subtitle] = screen.getAllByRole("textbox")
    expect(title).toHaveTextContent("Plan")
    expect(subtitle).toHaveTextContent("Week 1")
    expect(subtitle).toHaveAttribute("data-slot", "flow-card-subtitle")
  })

  it("shows an empty subtitle field in the edit state and saves it", () => {
    const updateData = vi.fn()
    renderCard({ text: "Plan", color: "white", subtitle: "" }, { editing: true, updateData })
    const subtitle = screen.getByRole("textbox", { name: "Add a detail" })
    subtitle.textContent = "Week 2"
    fireEvent.input(subtitle)
    expect(updateData).toHaveBeenCalledWith({ subtitle: "Week 2" })
  })
})
