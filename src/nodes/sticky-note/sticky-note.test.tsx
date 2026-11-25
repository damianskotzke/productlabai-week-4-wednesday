import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StickyNote, StickyNoteNode } from "./sticky-note"

describe("StickyNote", () => {
  it("uses the colour variant", () => {
    render(<StickyNote color="blue">Hello</StickyNote>)
    expect(screen.getByText("Hello")).toHaveClass("bg-note-blue")
  })

  it("tilts and shows the next colour on hover", () => {
    // The hover look must not show when the note is selected or in edit mode.
    const hover = "group-[:hover:not([data-selected]):not([data-editing])]/node"
    const nextColour = {
      yellow: "blue",
      blue: "purple",
      purple: "red",
      red: "green",
      green: "orange",
      orange: "yellow",
    } as const

    for (const [color, next] of Object.entries(nextColour)) {
      const { unmount } = render(<StickyNote color={color as keyof typeof nextColour}>Note</StickyNote>)
      const note = screen.getByText("Note")
      expect(note).toHaveClass(
        `bg-note-${color}`,
        `${hover}:bg-note-${next}`,
        `${hover}:text-note-${next}-foreground`,
        `${hover}:border-note-${next}-hover`,
        `${hover}:rotate-3`,
      )
      // No hover class may skip the edit-mode rule.
      const hoverClasses = [...note.classList].filter((name) => name.includes(":hover"))
      for (const name of hoverClasses) expect(name).toContain(":not([data-editing])")
      unmount()
    }
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

  it("shows the police lights when the note is selected or in edit", () => {
    const props = {
      id: "1",
      data: { text: "Stop! Police", color: "yellow" as const },
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
    expect(lights()!.querySelectorAll('[data-slot="sticky-note-lights-bulbs"]')).toHaveLength(2)

    rerender(<StickyNoteNode {...props} selected editing />)
    expect(lights()).not.toBeNull()
  })
})
