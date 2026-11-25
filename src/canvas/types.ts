/** A point or a size in board ("world") units or in screen pixels. */
export type Point = { x: number; y: number }

export type Rect = { x: number; y: number; width: number; height: number }

/** The camera. Screen position = world position * scale + (x, y). */
export type View = { x: number; y: number; scale: number }

export type Side = "top" | "right" | "bottom" | "left"

export type ReactionKind = "thumbs-up" | "star" | "sad" | "dog"

/**
 * A reaction badge on a node.
 * `x` and `y` are fractions of the node box (0 = left/top, 1 = right/bottom).
 */
export type Reaction = { kind: ReactionKind; x: number; y: number; rotation: number }

/** A small label on a node. Position works the same as for a reaction. */
export type Tag = { text: string; x: number; y: number; rotation: number }

/** Data that every node can have, whatever its type. The node shell draws it. */
export type SharedNodeData = {
  reactions?: Reaction[]
  tags?: Tag[]
}

/** One item on the board. `data` holds the fields of the node type. */
export type BoardNode = {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  /** Stack order. A higher number is nearer to the front. */
  z: number
  data: Record<string, unknown> & SharedNodeData
  /** Who made the node. The app has no names now, so new nodes have `null`. */
  createdBy: string | null
}

/** A connector between two nodes. */
export type BoardEdge = {
  id: string
  source: string
  target: string
  dashed: boolean
}

export type Selection = { kind: "node"; id: string } | { kind: "edge"; id: string } | null

export type BoardSnapshot = {
  title: string
  nodes: BoardNode[]
  edges: BoardEdge[]
}
