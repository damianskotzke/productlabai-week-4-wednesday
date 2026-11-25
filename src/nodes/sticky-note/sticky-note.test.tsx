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

  function renderNote(text: string) {
    render(
      <StickyNoteNode
        id="1"
        data={{ text, color: "blue" }}
        width={240}
        height={240}
        selected={false}
        editing={false}
        updateData={vi.fn()}
        stopEditing={vi.fn()}
      />,
    )
    return screen.getByRole("textbox").closest("[data-slot='sticky-note']")
  }

  it("is pink with white text when the text starts with $", () => {
    const note = renderNote("$100")
    expect(note).toHaveClass("bg-note-dollar", "text-note-dollar-foreground")
    expect(note).not.toHaveClass("bg-note-blue")
  })

  it("keeps its colour when $ is not the first character", () => {
    const note = renderNote("Cost: $100")
    expect(note).toHaveClass("bg-note-blue")
    expect(note).not.toHaveClass("bg-note-dollar")
  })
})
