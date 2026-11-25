import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StickyNote, StickyNoteNode } from "./sticky-note"

describe("StickyNote", () => {
  it("uses the colour variant", () => {
    render(<StickyNote color="blue">Hello</StickyNote>)
    expect(screen.getByText("Hello")).toHaveClass("bg-note-blue")
  })

  it("shows the saved text", () => {
    render(
      <StickyNoteNode
        id="1"
        data={{ text: "Ship it", color: "yellow" }}
        width={240}
        height={240}
        selected={false}
        editing={false}
        updateData={vi.fn()}
        stopEditing={vi.fn()}
      />,
    )
    expect(screen.getByRole("textbox")).toHaveTextContent("Ship it")
  })

  it("shows the Christmas lights when the note is selected or in edit", () => {
    const props = {
      id: "1",
      data: { text: "Ho ho ho", color: "yellow" as const },
      width: 240,
      height: 240,
      updateData: vi.fn(),
      stopEditing: vi.fn(),
    }
    const lights = () => container.querySelector('[data-slot="sticky-note-lights"]')
    const { container, rerender } = render(<StickyNoteNode {...props} selected={false} editing={false} />)
    expect(lights()).toBeNull()

    rerender(<StickyNoteNode {...props} selected editing={false} />)
    expect(lights()).not.toBeNull()
    expect(lights()!.querySelectorAll('[data-slot="sticky-note-lights-bulbs"]')).toHaveLength(3)

    rerender(<StickyNoteNode {...props} selected editing />)
    expect(lights()).not.toBeNull()
  })
})
