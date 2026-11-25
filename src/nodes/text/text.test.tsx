import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import definition from "./index"

const nodeProps = {
  id: "text-1",
  width: 240,
  height: 34,
  selected: true,
  editing: false,
  stopEditing: vi.fn(),
}
const Node = definition.component
const Toolbar = definition.toolbar!

describe("Text colour", () => {
  it("keeps the default colour for existing text nodes", () => {
    render(<Node {...nodeProps} data={{ text: "Existing text" }} updateData={vi.fn()} />)

    expect(screen.getByRole("textbox")).toHaveTextContent("Existing text")
    expect(screen.getByRole("textbox")).toHaveClass("text-foreground")
  })

  it("applies a saved colour and saves changes from the context bar", async () => {
    const user = userEvent.setup()
    const updateData = vi.fn()
    const data = { text: "Warning", color: "red" }
    render(
      <>
        <Node {...nodeProps} data={data} updateData={updateData} />
        <Toolbar {...nodeProps} data={data} updateData={updateData} />
      </>,
    )

    expect(screen.getByRole("textbox")).toHaveClass("text-destructive")
    await user.click(screen.getByRole("button", { name: "Colour" }))
    expect(screen.getByRole("button", { name: "Red", pressed: true })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Muted" }))

    expect(updateData).toHaveBeenCalledExactlyOnceWith({ color: "muted" })
  })
})
