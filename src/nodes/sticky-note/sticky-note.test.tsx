import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StickyNote, StickyNoteNode } from "./sticky-note"

describe("StickyNote", () => {
  it("uses the colour variant", () => {
    render(<StickyNote color="blue">Hello</StickyNote>)
    expect(screen.getByText("Hello")).toHaveClass("bg-note-blue")
  })

  it("tilts and shows the next colour on hover", () => {
    const hover = "group-[:hover:not([data-selected])]/node"
    const nextColour = { yellow: "blue", blue: "purple", purple: "red", red: "yellow" } as const

    for (const [color, next] of Object.entries(nextColour)) {
      const { unmount } = render(<StickyNote color={color as keyof typeof nextColour}>Note</StickyNote>)
      const note = screen.getByText("Note")
      expect(note).toHaveClass(`bg-note-${color}`, `${hover}:bg-note-${next}`, `${hover}:rotate-3`)
      unmount()
    }
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
})
