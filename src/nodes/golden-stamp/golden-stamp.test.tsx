import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { GOLDEN_STAMPS, GoldenStampNode, type GoldenStampData } from "./golden-stamp"

function renderNode(data: GoldenStampData) {
  return render(
    <GoldenStampNode
      id="1"
      data={data}
      width={120}
      height={120}
      selected={false}
      editing={false}
      updateData={vi.fn()}
      stopEditing={vi.fn()}
    />,
  )
}

describe("GoldenStamp", () => {
  it.each(GOLDEN_STAMPS)("shows the $mood stamp", ({ mood, label, text }) => {
    renderNode({ mood })
    expect(screen.getByRole("img", { name: label })).toHaveAttribute("data-mood", mood)
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it("shows the happy stamp when the data has no mood", () => {
    renderNode({} as GoldenStampData)
    expect(screen.getByRole("img", { name: "Happy golden" })).toBeInTheDocument()
  })
})
