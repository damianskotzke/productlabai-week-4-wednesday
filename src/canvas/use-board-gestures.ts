import { useEffect, type RefObject } from "react"
import { nodeDefinitions } from "@/nodes/registry"
import { hitTestEdge } from "./edges"
import { toWorld } from "./geometry"
import { SELECT_TOOL, useBoardStore } from "./store"
import type { Point } from "./types"

/**
 * All pointer, wheel and keyboard gestures of the board:
 * pan, zoom, select, drag, resize, connect, create, delete.
 *
 * The hook listens on the board element and finds the target with
 * `data-*` attributes (`data-node-id`, `data-handle`, `data-resize`).
 */

const DRAG_THRESHOLD = 3
const MIN_SIZE = { width: 80, height: 48 }

type Gesture =
  | { type: "pan"; last: Point }
  | { type: "move"; id: string; start: Point; origin: Point; moved: boolean }
  | { type: "resize"; id: string; start: Point; origin: { width: number; height: number } }
  | { type: "connect"; sourceId: string }

function isTyping(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null
  if (!element?.tagName) return false
  return element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)
}

function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}

export function useBoardGestures(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const board = ref.current
    if (!board) return
    const store = () => useBoardStore.getState()

    let gesture: Gesture | null = null
    let spaceDown = false

    const localPoint = (event: MouseEvent): Point => {
      const rect = board.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const worldPoint = (event: MouseEvent): Point => toWorld(store().view, localPoint(event))

    const startPan = (event: PointerEvent) => {
      gesture = { type: "pan", last: { x: event.clientX, y: event.clientY } }
      board.dataset.panning = "true"
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element
      // Toolbars and menus handle their own clicks.
      if (target.closest("[data-board-ui]")) return

      if (event.button === 1 || (event.button === 0 && spaceDown)) {
        event.preventDefault()
        startPan(event)
        return
      }
      if (event.button !== 0) return

      const state = store()
      const nodeElement = target.closest<HTMLElement>("[data-node-id]")
      const id = nodeElement?.dataset.nodeId

      // A creation tool is active: the click makes a new node.
      if (state.tool !== SELECT_TOOL) {
        blurActiveElement()
        state.addNode(state.tool, worldPoint(event))
        return
      }

      if (id && target.closest("[data-handle]")) {
        event.preventDefault()
        blurActiveElement()
        gesture = { type: "connect", sourceId: id }
        state.select({ kind: "node", id })
        state.setDraft({ sourceId: id, to: worldPoint(event), targetId: null })
        return
      }

      if (id && target.closest("[data-resize]")) {
        event.preventDefault()
        const node = state.nodes[id]
        gesture = {
          type: "resize",
          id,
          start: { x: event.clientX, y: event.clientY },
          origin: { width: node.width, height: node.height },
        }
        return
      }

      if (id) {
        // The node is in the edit state: let the person type and select text.
        if (state.editingId === id) return
        if (state.editingId) {
          blurActiveElement()
          state.setEditing(null)
        }
        state.select({ kind: "node", id })
        state.bringToFront(id)
        // Buttons and inputs in a node get the click, not a drag.
        if (target.closest("[data-no-drag], button, input, textarea, select, a")) return
        const node = state.nodes[id]
        gesture = {
          type: "move",
          id,
          start: { x: event.clientX, y: event.clientY },
          origin: { x: node.x, y: node.y },
          moved: false,
        }
        return
      }

      // Empty board.
      blurActiveElement()
      state.setEditing(null)
      const tolerance = 6 / state.view.scale
      const edgeId = hitTestEdge(state.edges, state.nodes, worldPoint(event), tolerance)
      if (edgeId) {
        state.select({ kind: "edge", id: edgeId })
        return
      }
      state.select(null)
      startPan(event)
    }

    // Stop the browser from moving the focus or selecting text on a board click.
    // Without this, a new node loses the focus before the person can type.
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Element
      if (isTyping(target)) return
      if (target.closest("[data-board-ui], button, a, input, textarea, select, [data-no-drag]")) return
      event.preventDefault()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!gesture) return
      const state = store()
      const scale = state.view.scale

      if (gesture.type === "pan") {
        state.panBy(event.clientX - gesture.last.x, event.clientY - gesture.last.y)
        gesture.last = { x: event.clientX, y: event.clientY }
        return
      }

      if (gesture.type === "move") {
        const dx = event.clientX - gesture.start.x
        const dy = event.clientY - gesture.start.y
        if (!gesture.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        gesture.moved = true
        state.patchNode(gesture.id, {
          x: Math.round(gesture.origin.x + dx / scale),
          y: Math.round(gesture.origin.y + dy / scale),
        })
        return
      }

      if (gesture.type === "resize") {
        const node = state.nodes[gesture.id]
        const definition = nodeDefinitions.find((entry) => entry.type === node?.type)
        const min = definition?.minSize ?? MIN_SIZE
        state.patchNode(gesture.id, {
          width: Math.max(
            min.width,
            Math.round(gesture.origin.width + (event.clientX - gesture.start.x) / scale),
          ),
          height: Math.max(
            min.height,
            Math.round(gesture.origin.height + (event.clientY - gesture.start.y) / scale),
          ),
        })
        return
      }

      if (gesture.type === "connect") {
        const sourceId = gesture.sourceId
        const targetId =
          document
            .elementsFromPoint(event.clientX, event.clientY)
            .map((element) => element.closest<HTMLElement>("[data-node-id][data-connectable]"))
            .find((element) => element && element.dataset.nodeId !== sourceId)?.dataset.nodeId ?? null
        state.setDraft({ sourceId, to: worldPoint(event), targetId })
      }
    }

    const onPointerUp = () => {
      if (!gesture) return
      const state = store()
      if (gesture.type === "move" && gesture.moved) state.commitNode(gesture.id)
      if (gesture.type === "resize") state.commitNode(gesture.id)
      if (gesture.type === "connect") {
        const targetId = state.draft?.targetId
        if (targetId) state.addEdge(gesture.sourceId, targetId)
        state.setDraft(null)
      }
      delete board.dataset.panning
      gesture = null
    }

    const onDoubleClick = (event: MouseEvent) => {
      const state = store()
      if (state.tool !== SELECT_TOOL) return
      const target = event.target as Element
      if (target.closest("[data-board-ui], [data-handle], [data-resize]")) return
      const id = target.closest<HTMLElement>("[data-node-id]")?.dataset.nodeId
      if (id && state.editingId !== id) {
        state.select({ kind: "node", id })
        state.setEditing(id)
      }
    }

    const onWheel = (event: WheelEvent) => {
      if ((event.target as Element).closest("[data-board-ui]")) return
      event.preventDefault()
      if (event.ctrlKey || event.metaKey) {
        store().zoomAtPoint(localPoint(event), Math.exp(-event.deltaY * 0.01))
      } else {
        store().panBy(-event.deltaX, -event.deltaY)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const state = store()
      if (event.key === "Escape") {
        blurActiveElement()
        state.setEditing(null)
        state.setTool(SELECT_TOOL)
        state.setDraft(null)
        if (!isTyping(event.target)) state.select(null)
        return
      }
      if (isTyping(event.target)) return
      // Keys in a menu or a dialog are not for the board.
      const target = event.target as Node
      if (target !== document.body && !board.contains(target)) return

      const command = event.metaKey || event.ctrlKey
      const center = { x: state.viewport.width / 2, y: state.viewport.height / 2 }
      if (command && event.key === "0") {
        event.preventDefault()
        state.zoomToFit()
      } else if (command && (event.key === "=" || event.key === "+")) {
        event.preventDefault()
        state.zoomAtPoint(center, 1.25)
      } else if (command && event.key === "-") {
        event.preventDefault()
        state.zoomAtPoint(center, 0.8)
      } else if (command || event.altKey) {
        return
      } else if (event.key === "Delete" || event.key === "Backspace") {
        state.removeSelection()
      } else if (event.key === " ") {
        spaceDown = true
        board.dataset.space = "true"
        event.preventDefault()
      } else if (event.key.toLowerCase() === "v") {
        state.setTool(SELECT_TOOL)
      } else {
        const definition = nodeDefinitions.find(
          (entry) => entry.shortcut?.toLowerCase() === event.key.toLowerCase(),
        )
        if (definition) state.setTool(definition.type)
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === " ") {
        spaceDown = false
        delete board.dataset.space
      }
    }

    board.addEventListener("pointerdown", onPointerDown)
    board.addEventListener("mousedown", onMouseDown)
    board.addEventListener("dblclick", onDoubleClick)
    board.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      board.removeEventListener("pointerdown", onPointerDown)
      board.removeEventListener("mousedown", onMouseDown)
      board.removeEventListener("dblclick", onDoubleClick)
      board.removeEventListener("wheel", onWheel)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [ref])
}
