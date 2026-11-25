import { useEffect, type RefObject } from "react"
import { toWorld } from "@/canvas/geometry"
import { useBoardStore } from "@/canvas/store"
import type { BoardNode } from "@/canvas/types"
import { getNodeDefinition } from "@/nodes/registry"

/** Each paste of a copied node moves the copy this far (world units) from the last one. */
const PASTE_OFFSET = 24

function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element?.tagName) return false
  return element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)
}

function textOf(node: BoardNode): string {
  return typeof node.data.text === "string" ? node.data.text : ""
}

/**
 * Copy and paste on the board (not in a text field):
 * - Cmd/Ctrl+C on a selected node copies it. Its text goes to the clipboard too.
 * - Cmd/Ctrl+V after that adds a copy of the node, a bit lower and to the right.
 * - Cmd/Ctrl+V with other text (for example from a different app) adds a sticky note with that text.
 *
 * Copy and paste in a text field that the person edits works as normal.
 */
export function useBoardClipboard(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const board = ref.current
    if (!board) return

    // The node that the person copied last, and the text that we put on the clipboard for it.
    let copied: { node: BoardNode; text: string } | null = null
    let pastes = 0

    const isForBoard = (event: ClipboardEvent) => {
      if (isTyping(event.target)) return false
      const target = event.target as Node | null
      return target === document.body || (target !== null && board.contains(target))
    }

    const onCopy = (event: ClipboardEvent) => {
      if (!isForBoard(event) || !event.clipboardData) return
      const { selection, nodes } = useBoardStore.getState()
      const node = selection?.kind === "node" ? nodes[selection.id] : undefined
      if (!node) return
      const text = textOf(node)
      event.clipboardData.setData("text/plain", text)
      event.preventDefault()
      copied = { node: structuredClone(node), text }
      pastes = 0
    }

    const pasteNode = (node: BoardNode) => {
      const state = useBoardStore.getState()
      pastes += 1
      const offset = PASTE_OFFSET * pastes
      // Reactions belong to the original node. Keep the content, the colour and the tags.
      const data = structuredClone(node.data)
      delete data.reactions
      const center = { x: node.x + node.width / 2 + offset, y: node.y + node.height / 2 + offset }
      const id = state.addNode(node.type, center, data)
      if (!id) return
      const created = useBoardStore.getState().nodes[id]
      if (created && (created.width !== node.width || created.height !== node.height)) {
        state.patchNode(id, {
          x: node.x + offset,
          y: node.y + offset,
          width: node.width,
          height: node.height,
        })
        state.commitNode(id)
      }
      state.setEditing(null)
    }

    const pasteText = (text: string) => {
      const state = useBoardStore.getState()
      const type = getNodeDefinition("sticky-note") ? "sticky-note" : "text"
      const center = toWorld(state.view, { x: state.viewport.width / 2, y: state.viewport.height / 2 })
      if (state.addNode(type, center, { text })) state.setEditing(null)
    }

    const onPaste = (event: ClipboardEvent) => {
      if (!isForBoard(event) || !event.clipboardData) return
      const text = event.clipboardData.getData("text/plain")
      const hasFiles = event.clipboardData.files.length > 0
      if (copied && !hasFiles && text === copied.text) {
        pasteNode(copied.node)
      } else if (text.trim()) {
        pasteText(text.trim())
      } else {
        return
      }
      event.preventDefault()
    }

    document.addEventListener("copy", onCopy)
    document.addEventListener("paste", onPaste)
    return () => {
      document.removeEventListener("copy", onCopy)
      document.removeEventListener("paste", onPaste)
    }
  }, [ref])
}
