import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { nodeDefinitions } from "./registry"

/**
 * The contract that each node type must obey.
 * This test finds all nodes automatically. Do not add your node here.
 */
describe("node registry", () => {
  it("finds the node types", () => {
    expect(nodeDefinitions.length).toBeGreaterThan(0)
  })

  it("has no two nodes with the same type", () => {
    const types = nodeDefinitions.map((definition) => definition.type)
    expect(new Set(types).size).toBe(types.length)
  })

  it("has no two nodes with the same shortcut", () => {
    const shortcuts = nodeDefinitions
      .map((definition) => definition.shortcut?.toLowerCase())
      .filter((shortcut) => shortcut !== undefined)
    expect(new Set(shortcuts).size).toBe(shortcuts.length)
    expect(shortcuts).not.toContain("v") // "V" is the Select tool.
  })

  describe.each(nodeDefinitions)("$type", (definition) => {
    it("has a kebab-case type", () => {
      expect(definition.type).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/)
    })

    it("has a label, an icon and an author", () => {
      expect(definition.label.trim()).not.toBe("")
      expect(definition.icon).toBeTruthy()
      expect(definition.author).toMatch(/^@[A-Za-z0-9-]+$/)
      expect(definition.author).not.toBe("@your-github-handle")
    })

    it("has a default size that is not too small", () => {
      expect(definition.defaultSize.width).toBeGreaterThanOrEqual(24)
      expect(definition.defaultSize.height).toBeGreaterThanOrEqual(24)
    })

    it("has default data that the database can save", () => {
      expect(JSON.parse(JSON.stringify(definition.defaultData))).toEqual(definition.defaultData)
    })

    it("renders with its default data", () => {
      const Component = definition.component
      const { container } = render(
        <Component
          id="test"
          data={definition.defaultData}
          width={definition.defaultSize.width}
          height={definition.defaultSize.height}
          selected={false}
          editing={false}
          updateData={vi.fn()}
          stopEditing={vi.fn()}
        />,
      )
      expect(container).not.toBeEmptyDOMElement()
    })
  })
})
