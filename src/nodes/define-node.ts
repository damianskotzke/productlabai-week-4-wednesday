import type { ComponentType } from "react"
import type { SharedNodeData } from "@/canvas/types"
import type { IconSvgElement } from "@/components/icon"

/** The props that the board gives to each node component. */
export type NodeProps<Data> = {
  id: string
  /** The saved data of this node. */
  data: Data & SharedNodeData
  width: number
  height: number
  /** True when the node is selected. */
  selected: boolean
  /** True after a double click. Show your edit state then. */
  editing: boolean
  /** Save a change. Give only the fields that changed. */
  updateData: (patch: Partial<Data>) => void
  /** Call this to leave the edit state. */
  stopEditing: () => void
}

/** All the facts that the board needs about one node type. */
export type NodeDefinition<Data> = {
  /** Unique id in kebab-case. It is the folder name and the database value. */
  type: string
  /** Short name for the toolbar tooltip. */
  label: string
  /** One sentence for the node gallery. */
  description?: string
  /** Toolbar icon. Use an icon from `@hugeicons/core-free-icons`. */
  icon: IconSvgElement
  /** One key that selects this tool, for example "S". Must be unique. */
  shortcut?: string
  /** Your GitHub handle, for example "@octocat". */
  author: string
  /** Size of a new node in board units. */
  defaultSize: { width: number; height: number }
  minSize?: { width: number; height: number }
  /** Data of a new node. Keep it small and JSON-safe. */
  defaultData: Data
  /** The component that draws the node. */
  component: ComponentType<NodeProps<Data>>
  /** Optional controls for the context bar of a selected node. */
  toolbar?: ComponentType<NodeProps<Data>>
  /** Set to false to hide the four connection dots. Default: true. */
  connectable?: boolean
  /** Set to false to hide the resize grip. Default: true. */
  resizable?: boolean
  /** Set to true to start the edit state immediately after creation. */
  editOnCreate?: boolean
  /** Set to false when the node has no edit state. A double click then does nothing. Default: true. */
  editable?: boolean
}

// The registry holds node types with different data shapes in one list.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyNodeDefinition = NodeDefinition<any>

/**
 * Describe a node type. Put the result in `src/nodes/<type>/index.ts`
 * as the default export. The registry finds the file automatically.
 */
export function defineNode<Data>(definition: NodeDefinition<Data>): AnyNodeDefinition {
  return definition
}
