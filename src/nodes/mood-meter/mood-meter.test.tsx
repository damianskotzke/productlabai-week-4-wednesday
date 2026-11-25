import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MoodMeterNode, type MoodMeterData } from "./mood-meter"

function renderNode(data: Partial<MoodMeterData>, updateData = vi.fn()) {
  render(
    <MoodMeterNode
      id="1"
      data={data as MoodMeterData}
      width={280}
      height={130}
      selected={false}
      editing={false}
      updateData={updateData}
      stopEditing={vi.fn()}
    />,
  )
  return updateData
}

describe("MoodMeterNode", () => {
  it("shows the saved question", () => {
    renderNode({ question: "How was the week?", mood: null })
    expect(screen.getByRole("textbox")).toHaveTextContent("How was the week?")
  })

  it("shows five faces and marks the saved mood", () => {
    renderNode({ question: "", mood: 4 })
    expect(screen.getAllByRole("button")).toHaveLength(5)
    expect(screen.getByRole("button", { name: "Happy" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Sad" })).toHaveAttribute("aria-pressed", "false")
  })

  it("saves the mood on a click", () => {
    const updateData = renderNode({ question: "", mood: null })
    fireEvent.click(screen.getByRole("button", { name: "Very happy" }))
    expect(updateData).toHaveBeenCalledWith({ mood: 5 })
  })

  it("clears the mood on a second click", () => {
    const updateData = renderNode({ question: "", mood: 2 })
    fireEvent.click(screen.getByRole("button", { name: "Sad" }))
    expect(updateData).toHaveBeenCalledWith({ mood: null })
  })

  it("works with missing or wrong data", () => {
    renderNode({ mood: 9 as MoodMeterData["mood"] })
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("aria-pressed", "false")
    }
  })
})
