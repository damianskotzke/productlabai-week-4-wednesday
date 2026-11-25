import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CoolStickerNode, normalizeAngle, type CoolStickerData } from "./cool-sticker"

describe("normalizeAngle", () => {
  it("keeps the angle from -180 to 180", () => {
    expect(normalizeAngle(0)).toBe(0)
    expect(normalizeAngle(190)).toBe(-170)
    expect(normalizeAngle(-195)).toBe(165)
    expect(normalizeAngle(720.4)).toBe(0)
  })
})

function renderSticker(data: CoolStickerData) {
  render(
    <CoolStickerNode
      id="1"
      data={data}
      width={180}
      height={180}
      selected={false}
      editing={false}
      updateData={vi.fn()}
      stopEditing={vi.fn()}
    />,
  )
}

describe("CoolStickerNode", () => {
  it("shows the saved sticker", () => {
    renderSticker({ sticker: "pookie" })
    expect(screen.getByRole("img")).toHaveAccessibleName("Pookie sticker")
  })

  it("turns the sticker by its saved rotation", () => {
    renderSticker({ sticker: "pookie", rotation: 30 })
    expect(screen.getByRole("img").closest('[data-slot="cool-sticker"]')).toHaveStyle({ rotate: "30deg" })
  })

  it("is not turned when an older sticker has no rotation", () => {
    renderSticker({ sticker: "pookie" })
    expect(screen.getByRole("img").closest('[data-slot="cool-sticker"]')).toHaveStyle({ rotate: "0deg" })
  })

  it("shows the first sticker for an unknown id", () => {
    renderSticker({ sticker: "old-sticker" as CoolStickerData["sticker"] })
    expect(screen.getByRole("img")).toHaveAccessibleName("Delulu sticker")
  })
})
