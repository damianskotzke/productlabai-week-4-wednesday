import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { StickerNode, StickerToolbar, type StickerData } from "./sticker"
import { STICKERS } from "./stickers"

function nodeProps(data: StickerData) {
  return {
    id: "1",
    data,
    width: 160,
    height: 160,
    selected: true,
    editing: false,
    updateData: vi.fn(),
    stopEditing: vi.fn(),
  }
}

describe("StickerNode", () => {
  it("shows the saved sticker", () => {
    render(<StickerNode {...nodeProps({ sticker: "rocket" })} />)
    expect(screen.getByRole("img", { name: "Rocket sticker" })).toBeInTheDocument()
  })

  it("shows the first sticker when the data is old or unknown", () => {
    render(<StickerNode {...nodeProps({} as StickerData)} />)
    expect(screen.getByRole("img", { name: "Star sticker" })).toBeInTheDocument()
  })
})

describe("StickerToolbar", () => {
  it("saves the sticker that the person picks", async () => {
    const props = nodeProps({ sticker: "star" })
    render(<StickerToolbar {...props} />)
    await userEvent.click(screen.getByRole("button", { name: "Choose sticker" }))
    await userEvent.click(await screen.findByRole("button", { name: "Heart" }))
    expect(props.updateData).toHaveBeenCalledWith({ sticker: "heart" })
  })

  it("opens the picker in the edit state, and leaves that state after a pick", async () => {
    const props = { ...nodeProps({ sticker: "star" }), editing: true }
    render(<StickerToolbar {...props} />)
    await userEvent.click(await screen.findByRole("button", { name: "Cat" }))
    expect(props.updateData).toHaveBeenCalledWith({ sticker: "cat" })
    expect(props.stopEditing).toHaveBeenCalled()
  })
})

describe("STICKERS", () => {
  it("has no two stickers with the same id", () => {
    expect(new Set(STICKERS.map((sticker) => sticker.id)).size).toBe(STICKERS.length)
  })
})
