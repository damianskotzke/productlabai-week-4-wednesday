import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NoteIcon, SquareIcon, StarIcon } from "@hugeicons/core-free-icons"
import { describe, expect, it, vi } from "vitest"
import { defineNode } from "@/nodes/define-node"
import { NodeMenu, filterNodeDefinitions } from "./node-menu"

function makeDefinition(type: string, label: string, author: string, icon = SquareIcon) {
  return defineNode({
    type,
    label,
    author,
    icon,
    defaultSize: { width: 100, height: 100 },
    defaultData: {},
    component: () => null,
  })
}

const definitions = [
  makeDefinition("kanban-card", "Kanban card", "@anna", NoteIcon),
  makeDefinition("emoji-stamp", "Emoji stamp", "@bartek", StarIcon),
  makeDefinition("heading", "Heading", "@celina"),
]

describe("filterNodeDefinitions", () => {
  it("keeps all node types for an empty query", () => {
    expect(filterNodeDefinitions(definitions, "  ")).toHaveLength(3)
  })

  it("finds a node type by label, in any case", () => {
    expect(filterNodeDefinitions(definitions, "KANBAN").map((d) => d.type)).toEqual(["kanban-card"])
  })

  it("finds a node type by author", () => {
    expect(filterNodeDefinitions(definitions, "bartek").map((d) => d.type)).toEqual(["emoji-stamp"])
  })

  it("returns nothing when no node type matches", () => {
    expect(filterNodeDefinitions(definitions, "xyz")).toEqual([])
  })
})

describe("NodeMenu", () => {
  async function openMenu() {
    const user = userEvent.setup()
    const onPick = vi.fn()
    render(<NodeMenu definitions={definitions} activeType="select" onPick={onPick} />)
    await user.click(screen.getByRole("button", { name: "More nodes" }))
    return { user, onPick, input: await screen.findByRole("combobox", { name: "Search nodes" }) }
  }

  it("gives the focus to the search input when it opens", async () => {
    const { input } = await openMenu()
    expect(input).toHaveFocus()
  })

  it("filters the list while the person types", async () => {
    const { user, input } = await openMenu()
    await user.type(input, "emo")
    expect(screen.getAllByRole("option")).toHaveLength(1)
    expect(screen.getByRole("option")).toHaveTextContent("Emoji stamp")
  })

  it("shows a message when nothing matches", async () => {
    const { user, input } = await openMenu()
    await user.type(input, "xyz")
    expect(screen.queryByRole("option")).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent('No node matches "xyz".')
  })

  it("picks a node with the arrow keys and Enter", async () => {
    const { user, onPick } = await openMenu()
    await user.keyboard("{ArrowDown}{Enter}")
    expect(onPick).toHaveBeenCalledWith("emoji-stamp")
  })

  it("picks a node with a click", async () => {
    const { user, onPick } = await openMenu()
    await user.click(screen.getByRole("option", { name: /Heading/ }))
    expect(onPick).toHaveBeenCalledWith("heading")
  })
})
