import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TemplateNode } from "./template"

describe("TemplateNode", () => {
  it("shows the saved text", () => {
    render(
      <TemplateNode
        id="1"
        data={{ text: "Hello" }}
        width={240}
        height={120}
        selected={false}
        editing={false}
        updateData={vi.fn()}
        stopEditing={vi.fn()}
      />,
    )
    expect(screen.getByRole("textbox")).toHaveTextContent("Hello")
  })
})
