import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { CanvasLayer } from "@/canvas/canvas-layer"
import { toWorld } from "@/canvas/geometry"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import { useBoardGestures } from "@/canvas/use-board-gestures"
import { WorldLayer } from "@/canvas/world-layer"
import cursorUrl from "@/assets/cursor.svg"
import { uploadFile } from "@/lib/storage"
import { useBoardSync } from "@/lib/use-board-sync"
import { cn } from "@/lib/utils"
import { getNodeDefinition } from "@/nodes/registry"
import { ContextBar } from "./context-bar"
import { COOL_STICKER_DRAG_TYPE, COOL_STICKER_TOOL, CoolStickerCursorPreview, useCoolStickerChoice } from "./cool-sticker-picker"
import { TopBar } from "./top-bar"

/** The full whiteboard page: canvas, nodes, bars. */
function Board() {
  const ref = useRef<HTMLDivElement>(null)
  const creating = useBoardStore((state) => state.tool !== SELECT_TOOL)
  const linking = useBoardStore((state) => state.draft !== null)

  useBoardSync()
  useBoardGestures(ref)

  // Tell the store the size of the board, for "zoom to fit" and the canvas.
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      useBoardStore.getState().setViewport(element.clientWidth, element.clientHeight)
    })
    observer.observe(element)
    useBoardStore.getState().setViewport(element.clientWidth, element.clientHeight)
    return () => observer.disconnect()
  }, [])

  const pointFromEvent = (event: { clientX: number; clientY: number }) => {
    const rect = ref.current!.getBoundingClientRect()
    return toWorld(useBoardStore.getState().view, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  // The sticker tool is active: the click puts the chosen sticker on the board.
  // This runs before the board gestures, because they make a node without data.
  const onPointerDownCapture = (event: React.PointerEvent) => {
    const state = useBoardStore.getState()
    if (state.tool !== COOL_STICKER_TOOL || event.button !== 0 || !ref.current) return
    if ((event.target as Element).closest("[data-board-ui]")) return
    event.stopPropagation()
    state.addNode(COOL_STICKER_TOOL, pointFromEvent(event), { sticker: useCoolStickerChoice.getState().sticker })
  }

  // Drop an image file on the board to make an image node,
  // or drop a sticker from the sticker picker.
  const onDrop = async (event: React.DragEvent) => {
    const sticker = event.dataTransfer.getData(COOL_STICKER_DRAG_TYPE)
    if (sticker && ref.current) {
      event.preventDefault()
      useBoardStore.getState().addNode(COOL_STICKER_TOOL, pointFromEvent(event), { sticker })
      return
    }
    const file = Array.from(event.dataTransfer.files).find((entry) => entry.type.startsWith("image/"))
    if (!file || !getNodeDefinition("image") || !ref.current) return
    event.preventDefault()
    const point = pointFromEvent(event)
    try {
      const uploaded = await uploadFile(file)
      useBoardStore.getState().addNode("image", point, { src: uploaded.url, alt: uploaded.name })
    } catch (error) {
      toast.error("Could not upload the image", {
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <div
      ref={ref}
      data-slot="board"
      data-linking={linking || undefined}
      onPointerDownCapture={onPointerDownCapture}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "group/board relative size-full touch-none overflow-hidden bg-background",
        "data-panning:cursor-grabbing! data-space:cursor-grab",
        creating && "cursor-crosshair",
      )}
      style={creating ? undefined : { cursor: `url(${cursorUrl}) 12 10, default` }}
    >
      <CanvasLayer />
      <WorldLayer />
      <CoolStickerCursorPreview boardRef={ref} />
      <TopBar />
      <ContextBar />
    </div>
  )
}

export { Board }
