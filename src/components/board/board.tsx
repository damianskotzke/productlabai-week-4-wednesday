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
import { StampPalette } from "./stamp-palette"
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

  // Drop an image file on the board to make an image node.
  const onDrop = async (event: React.DragEvent) => {
    const file = Array.from(event.dataTransfer.files).find((entry) => entry.type.startsWith("image/"))
    if (!file || !getNodeDefinition("image") || !ref.current) return
    event.preventDefault()
    const rect = ref.current.getBoundingClientRect()
    const state = useBoardStore.getState()
    const point = toWorld(state.view, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    try {
      const uploaded = await uploadFile(file)
      state.addNode("image", point, { src: uploaded.url, alt: uploaded.name })
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
      <TopBar />
      <StampPalette />
      <ContextBar />
    </div>
  )
}

export { Board }
