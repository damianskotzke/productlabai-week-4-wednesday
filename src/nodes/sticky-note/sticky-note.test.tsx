import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StickyNote, StickyNoteNode } from "./sticky-note"

describe("StickyNote", () => {
  it("uses the colour variant", () => {
    render(<StickyNote color="blue">Hello</StickyNote>)
    expect(screen.getByText("Hello")).toHaveClass("bg-note-blue")
  })

  it.each([
    ["green", "bg-note-green"],
    ["orange", "bg-note-orange"],
  ] as const)("uses the %s colour", (color, className) => {
    render(<StickyNote color={color}>Hello</StickyNote>)
    expect(screen.getByText("Hello")).toHaveClass(className)
  })

  it("keeps an old note without a colour yellow", () => {
    render(<StickyNote>Old note</StickyNote>)
    expect(screen.getByText("Old note")).toHaveClass("bg-note-yellow")
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
