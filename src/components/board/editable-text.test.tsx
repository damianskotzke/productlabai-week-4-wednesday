import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { EditableText, splitMentions } from "./editable-text"

describe("splitMentions", () => {
  it("finds the mentions in the text", () => {
    expect(splitMentions("Ask @[Takumi] and @[Ana Li].")).toEqual([
      { kind: "text", text: "Ask " },
      { kind: "mention", name: "Takumi" },
      { kind: "text", text: " and " },
      { kind: "mention", name: "Ana Li" },
      { kind: "text", text: "." },
    ])
  })

  it("keeps text without a full mention as plain text", () => {
    expect(splitMentions("mail @Takumi or @[] or @[open")).toEqual([
      { kind: "text", text: "mail @Takumi or @[] or @[open" },
    ])
  })
})

describe("EditableText with mentions", () => {
  it("shows a chip when the person does not type", () => {
    const { container } = render(<EditableText value="Ask @[Takumi]" editing={false} onChange={vi.fn()} mentions />)
    const chip = container.querySelector('[data-slot="mention-chip"]')
    expect(chip).toHaveTextContent("Takumi")
    expect(screen.getByRole("textbox")).not.toHaveTextContent("@[Takumi]")
  })

  it("shows the plain text in edit mode, and saves plain text", () => {
    const onChange = vi.fn()
    const { container } = render(<EditableText value="Ask @[Takumi]" editing onChange={onChange} mentions />)
    const box = screen.getByRole("textbox")
    expect(box).toHaveTextContent("Ask @[Takumi]")
    expect(container.querySelector('[data-slot="mention-chip"]')).toBeNull()

    box.textContent = "Ask @[Takumi] now"
    fireEvent.input(box)
    expect(onChange).toHaveBeenCalledWith("Ask @[Takumi] now")
  })

  it("does not repeat the text after edit mode", () => {
    const { container, rerender } = render(
      <EditableText value="Hi @[Takumi]" editing={false} onChange={vi.fn()} mentions />,
    )
    rerender(<EditableText value="Hi @[Takumi]" editing onChange={vi.fn()} mentions />)
    rerender(<EditableText value="Hi @[Takumi]" editing={false} onChange={vi.fn()} mentions />)
    // "T" is the avatar letter. "@" is for screen readers.
    expect(screen.getByRole("textbox").textContent).toBe("Hi T@Takumi")
    expect(container.querySelectorAll('[data-slot="mention-chip"]')).toHaveLength(1)
  })

  it("does not show chips without the mentions prop", () => {
    const { container } = render(<EditableText value="Ask @[Takumi]" editing={false} onChange={vi.fn()} />)
    expect(container.querySelector('[data-slot="mention-chip"]')).toBeNull()
    expect(screen.getByRole("textbox")).toHaveTextContent("Ask @[Takumi]")
  })
})
