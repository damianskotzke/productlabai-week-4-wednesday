import { useEffect, useState } from "react"
import { StickerIcon } from "@hugeicons/core-free-icons"
import { create } from "zustand"
import { useBoardStore } from "@/canvas/store"
import { Icon } from "@/components/icon"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { getNodeDefinition } from "@/nodes/registry"
import { STICKERS, getSticker, type StickerId } from "@/nodes/sticker/sticker"
import { BarButton } from "./bar"

/** The node type of a sticker. */
const STICKER_TOOL = "sticker"

/** The drag-and-drop data type for a sticker from the picker. */
const STICKER_DRAG_TYPE = "application/x-board-sticker"

/** The sticker that the next click on the board puts down. */
const useStickerChoice = create<{ sticker: StickerId; choose: (sticker: StickerId) => void }>((set) => ({
  sticker: STICKERS[0].id,
  choose: (sticker) => set({ sticker }),
}))

/**
 * The "Cool stickers" button in the top bar.
 * Click a sticker, then click the board. Or drag a sticker to the board.
 */
function StickerPicker() {
  const tool = useBoardStore((state) => state.tool)
  const setTool = useBoardStore((state) => state.setTool)
  const chosen = useStickerChoice((state) => state.sticker)
  const choose = useStickerChoice((state) => state.choose)
  const [open, setOpen] = useState(false)
  const active = tool === STICKER_TOOL

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<BarButton label="Cool stickers" active={active || open} />}>
        <Icon icon={StickerIcon} />
      </PopoverTrigger>
      <PopoverContent data-board-ui side="bottom" sideOffset={12} className="w-auto">
        <PopoverTitle>Cool stickers</PopoverTitle>
        <p className="text-xs text-muted-foreground">Click a sticker, then click the board. Or drag it.</p>
        <div data-slot="sticker-picker-list" className="flex items-center gap-2">
          {STICKERS.map((sticker) => (
            <button
              key={sticker.id}
              type="button"
              draggable
              aria-label={sticker.label}
              title={sticker.label}
              data-active={(active && chosen === sticker.id) || undefined}
              className="flex size-24 cursor-grab items-center justify-center rounded-lg border border-transparent p-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing data-active:border-selection data-active:bg-muted"
              onClick={() => {
                choose(sticker.id)
                setTool(STICKER_TOOL)
                setOpen(false)
              }}
              onDragStart={(event) => {
                event.dataTransfer.setData(STICKER_DRAG_TYPE, sticker.id)
                event.dataTransfer.effectAllowed = "copy"
              }}
              onDragEnd={() => setOpen(false)}
            >
              <img src={sticker.src} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A see-through copy of the chosen sticker that follows the pointer,
 * so the person sees where the sticker will go. Put it in the board element.
 */
function StickerCursorPreview({ boardRef }: { boardRef: React.RefObject<HTMLElement | null> }) {
  const active = useBoardStore((state) => state.tool === STICKER_TOOL)
  const scale = useBoardStore((state) => state.view.scale)
  const sticker = getSticker(useStickerChoice((state) => state.sticker))
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const board = boardRef.current
    if (!active || !board) return
    const onMove = (event: PointerEvent) => {
      const rect = board.getBoundingClientRect()
      setPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    const onLeave = () => setPoint(null)
    board.addEventListener("pointermove", onMove)
    board.addEventListener("pointerleave", onLeave)
    return () => {
      board.removeEventListener("pointermove", onMove)
      board.removeEventListener("pointerleave", onLeave)
      setPoint(null)
    }
  }, [active, boardRef])

  const definition = getNodeDefinition(STICKER_TOOL)
  if (!active || !point || !definition) return null
  const width = definition.defaultSize.width * scale
  const height = definition.defaultSize.height * scale

  return (
    <img
      data-slot="sticker-cursor-preview"
      src={sticker.src}
      alt=""
      aria-hidden
      draggable={false}
      className="pointer-events-none absolute z-30 object-contain opacity-60 drop-shadow-md"
      style={{ left: point.x - width / 2, top: point.y - height / 2, width, height }}
    />
  )
}

export { STICKER_DRAG_TYPE, STICKER_TOOL, StickerCursorPreview, StickerPicker, useStickerChoice }
