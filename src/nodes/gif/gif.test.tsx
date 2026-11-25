import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { GifNode, type GifData } from "./gif"
import { GIF_LIBRARY, searchGifLibrary, toGifUrl } from "./gif-library"

function renderGif(data: Partial<GifData>, updateData = vi.fn()) {
  render(
    <GifNode
      id="1"
      data={data as GifData}
      width={320}
      height={240}
      selected={false}
      editing={false}
      updateData={updateData}
      stopEditing={vi.fn()}
    />,
  )
  return updateData
}

describe("toGifUrl", () => {
  it("keeps a direct link", () => {
    expect(toGifUrl(" https://media.tenor.com/abc/cat.gif ")).toBe("https://media.tenor.com/abc/cat.gif")
  })

  it("changes a Giphy page link to the GIF file", () => {
    expect(toGifUrl("https://giphy.com/gifs/cat-funny-JIX9t2j0ZTN9S")).toBe(
      "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    )
  })

  it("does not take text that is not an http(s) link", () => {
    expect(toGifUrl("cat")).toBeNull()
    expect(toGifUrl("javascript:alert(1)")).toBeNull()
  })
})

describe("searchGifLibrary", () => {
  it("gives all GIFs for an empty search", () => {
    expect(searchGifLibrary("  ")).toHaveLength(GIF_LIBRARY.length)
  })

  it("finds GIFs by label and tag, in any case", () => {
    const labels = searchGifLibrary("PARTY").map((gif) => gif.label)
    expect(labels).toContain("Party time")
    expect(labels).toContain("Cheers")
  })

  it("needs all words to match", () => {
    expect(searchGifLibrary("dog dance").map((gif) => gif.label)).toEqual(["Dancing dog"])
    expect(searchGifLibrary("zebra")).toEqual([])
  })

  it("has no two GIFs with the same id", () => {
    const ids = GIF_LIBRARY.map((gif) => gif.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe("GifNode", () => {
  it("shows the saved GIF", () => {
    renderGif({ src: "https://example.com/cat.gif", alt: "A cat" })
    expect(screen.getByRole("img", { name: "A cat" })).toHaveAttribute("src", "https://example.com/cat.gif")
  })

  it("saves a pasted link", async () => {
    const updateData = renderGif({ src: "", alt: "" })
    await userEvent.click(screen.getByRole("button", { name: /Browse GIFs/ }))
    await userEvent.type(screen.getByRole("textbox", { name: "GIF link" }), "https://example.com/dog.gif")
    await userEvent.click(screen.getByRole("button", { name: "Add" }))
    expect(updateData).toHaveBeenCalledWith({ src: "https://example.com/dog.gif", alt: "GIF" })
  })

  it("shows a message when the link does not load", () => {
    renderGif({ src: "https://example.com/not-an-image" })
    fireEvent.error(screen.getByRole("img"))
    expect(screen.getByText(/does not show an image/)).toBeInTheDocument()
  })

  it("saves a GIF from the library", async () => {
    const updateData = renderGif({ src: "", alt: "" })
    await userEvent.click(screen.getByRole("button", { name: /Browse GIFs/ }))
    await userEvent.type(screen.getByRole("textbox", { name: "Search GIFs" }), "facepalm")
    await userEvent.click(screen.getByRole("button", { name: "Facepalm" }))
    expect(updateData).toHaveBeenCalledWith({
      src: "https://media.giphy.com/media/XD4qHZpkyUFfq/giphy.gif",
      alt: "Facepalm",
    })
  })

  it("works with old data that has no fields", () => {
    renderGif({})
    expect(screen.getByRole("button", { name: /Browse GIFs/ })).toBeInTheDocument()
  })
})
