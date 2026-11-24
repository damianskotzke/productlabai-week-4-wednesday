import type { AnyNodeDefinition } from "./define-node"

/**
 * The registry finds each `src/nodes/<type>/index.ts` file automatically.
 *
 * DO NOT add your node to this file by hand. Make a folder with
 * `pnpm new:node <name>`, and the node shows in the toolbar.
 * Folders that start with "_" are ignored.
 */
const modules = import.meta.glob<{ default: AnyNodeDefinition }>(["./*/index.ts", "!./_*/index.ts"], {
  eager: true,
})

export const nodeDefinitions: AnyNodeDefinition[] = Object.values(modules)
  .map((module) => module.default)
  .filter(Boolean)
  .sort((a, b) => a.label.localeCompare(b.label))

const byType = new Map(nodeDefinitions.map((definition) => [definition.type, definition]))

export function getNodeDefinition(type: string): AnyNodeDefinition | undefined {
  return byType.get(type)
}
