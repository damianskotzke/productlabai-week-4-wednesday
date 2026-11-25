import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TooltipProvider } from "@/components/ui/tooltip"
import { EmojiStampNode, EmojiStampToolbar, emojiSize } from "./emoji-stamp"

const baseProps = {
  id: "1",
  width: 120,
  height: 120,
  selected: false,
  editing: false,
  stopEditing: vi.fn(),
}

describe("EmojiStampNode", () => {
  it("shows the saved emoji", () => {
    render(<EmojiStampNode {...baseProps} data={{ emoji: "🔥" }} updateData={vi.fn()} />)
    expect(screen.getByRole("img", { name: "Fire" })).toHaveTextContent("🔥")
  })

  it("shows thumbs up for old or unknown data", () => {
    render(<EmojiStampNode {...baseProps} data={{ emoji: "🦄" }} updateData={vi.fn()} />)
    expect(screen.getByRole("img", { name: "Thumbs up" })).toBeInTheDocument()
  })

  it("grows with the shorter side of the node", () => {
    expect(emojiSize(200, 100)).toBe(80)
    expect(emojiSize(50, 300)).toBe(40)
  })
})

describe("EmojiStampToolbar", () => {
  it("saves the chosen stamp", () => {
    const updateData = vi.fn()
    render(
      <TooltipProvider>
        <EmojiStampToolbar {...baseProps} data={{ emoji: "👍" }} updateData={updateData} />
      </TooltipProvider>,
    )
    expect(screen.getByRole("button", { name: "Thumbs up" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Heart" }))
    expect(updateData).toHaveBeenCalledWith({ emoji: "❤️" })
  })
})
