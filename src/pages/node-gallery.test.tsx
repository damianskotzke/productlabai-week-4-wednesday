import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { NodeGallery } from "./node-gallery"

function firstCard() {
  return document.querySelector<HTMLElement>("[data-node-type]")!
}

function nodeWrapper(card: HTMLElement) {
  return card.querySelector<HTMLElement>(".group\\/node")!
}

describe("node gallery: selected look", () => {
  it("shows the selected look after a click and the idle look after a second click", async () => {
    const user = userEvent.setup()
    render(<NodeGallery />)
    const card = firstCard()
    const [toggle] = screen.getAllByRole("button", { name: "Show selected look" })
    expect(nodeWrapper(card).dataset.selected).toBeUndefined()

    await user.click(toggle)
    expect(nodeWrapper(card).dataset.selected).toBe("true")
    expect(toggle.getAttribute("aria-pressed")).toBe("true")

    await user.click(toggle)
    expect(nodeWrapper(card).dataset.selected).toBeUndefined()
  })

  it("works with the keyboard and changes only its own card", async () => {
    const user = userEvent.setup()
    render(<NodeGallery />)
    const cards = document.querySelectorAll<HTMLElement>("[data-node-type]")
    const [toggle] = screen.getAllByRole("button", { name: "Show selected look" })

    toggle.focus()
    await user.keyboard("{Enter}")
    expect(nodeWrapper(cards[0]).dataset.selected).toBe("true")
    expect(nodeWrapper(cards[1]).dataset.selected).toBeUndefined()

    await user.keyboard(" ")
    expect(nodeWrapper(cards[0]).dataset.selected).toBeUndefined()
  })
})
