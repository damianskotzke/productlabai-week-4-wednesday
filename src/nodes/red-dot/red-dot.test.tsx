import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RedDotNode } from "./red-dot"

describe("RedDotNode", () => {
  it("shows a red dot", () => {
    render(
      <RedDotNode
        id="1"
        data={{}}
        width={48}
        height={48}
        selected={false}
        editing={false}
        updateData={vi.fn()}
        stopEditing={vi.fn()}
      />,
    )
    const dot = screen.getByRole("img", { name: "Red dot" })
    expect(dot).toHaveClass("bg-destructive", "rounded-full")
  })
})
