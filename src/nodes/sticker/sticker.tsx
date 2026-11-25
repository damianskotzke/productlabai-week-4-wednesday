import { useRef } from "react"
import { RotateCcwIcon, RotateCwIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"
import certifiedYapper from "./images/certified-yapper.png"
import delulu from "./images/delulu.png"
import pookie from "./images/pookie.png"

/** All the stickers that a person can put on the board. */
const STICKERS = [
  { id: "delulu", label: "Delulu", src: delulu },
  { id: "pookie", label: "Pookie", src: pookie },
  { id: "certified-yapper", label: "Certified yapper", src: certifiedYapper },
] as const

export type StickerId = (typeof STICKERS)[number]["id"]

/** The data that the board saves for this node. */
export type StickerData = {
  sticker: StickerId
  /** Rotation in degrees, from -180 to 180. Optional: older stickers do not have it. */
  rotation?: number
}

/** One click on a rotate button turns the sticker this much. With Shift, the handle snaps to it. */
const ROTATE_STEP = 15

/** Find a sticker by id. An unknown id (for example from a newer version) gives the first sticker. */
function getSticker(id: string | undefined) {
  return STICKERS.find((sticker) => sticker.id === id) ?? STICKERS[0]
}

/** Keep an angle from -180 to 180 degrees, as a whole number. */
function normalizeAngle(degrees: number) {
  const angle = ((((degrees + 180) % 360) + 360) % 360) - 180
  return Math.round(angle)
}

function Sticker({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticker"
      className={cn(
        "relative flex size-full items-center justify-center rounded-lg outline-2 outline-offset-2 outline-transparent transition-colors",
        "group-[:hover:not([data-selected])]/node:outline-edge-dashed group-data-selected/node:outline-selection",
        className,
      )}
      {...props}
    />
  )
}

function StickerImage({ className, alt, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="sticker-image"
      alt={alt}
      draggable={false}
      className={cn("pointer-events-none size-full object-contain drop-shadow-md", className)}
      {...props}
    />
  )
}

/** A round handle above a selected sticker. Drag it to rotate. Hold Shift to snap to 15°. */
function StickerRotateHandle({
  className,
  onRotate,
  ...props
}: Omit<React.ComponentProps<"button">, "onPointerDown"> & { onRotate: (degrees: number) => void }) {
  const center = useRef({ x: 0, y: 0 })

  const angleOf = (event: React.PointerEvent) => {
    const degrees =
      (Math.atan2(event.clientY - center.current.y, event.clientX - center.current.x) * 180) / Math.PI + 90
    return normalizeAngle(event.shiftKey ? Math.round(degrees / ROTATE_STEP) * ROTATE_STEP : degrees)
  }

  return (
    <button
      type="button"
      data-slot="sticker-rotate-handle"
      aria-label="Rotate sticker"
      title="Drag to rotate. Hold Shift to snap."
      className={cn(
        "absolute -top-7 left-1/2 hidden size-5 -translate-x-1/2 cursor-grab items-center justify-center rounded-full border-2 border-selection bg-background text-selection active:cursor-grabbing group-data-selected/node:flex [&_svg]:size-3",
        className,
      )}
      onPointerDown={(event) => {
        event.preventDefault()
        // The centre of the node frame. The frame does not rotate, so its centre stays the same.
        const frame = event.currentTarget.closest("[data-node-id]") ?? event.currentTarget
        const rect = frame.getBoundingClientRect()
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) onRotate(angleOf(event))
      }}
      {...props}
    >
      <Icon icon={RotateCwIcon} />
    </button>
  )
}

/** The component that the board draws. */
function StickerNode({ data, updateData }: NodeProps<StickerData>) {
  const sticker = getSticker(data.sticker)
  return (
    <Sticker style={{ rotate: `${data.rotation ?? 0}deg` }}>
      <StickerImage src={sticker.src} alt={`${sticker.label} sticker`} />
      <StickerRotateHandle onRotate={(rotation) => updateData({ rotation })} />
    </Sticker>
  )
}

/** Rotate buttons in the context bar. */
function StickerToolbar({ data, updateData }: NodeProps<StickerData>) {
  const rotate = (by: number) => updateData({ rotation: normalizeAngle((data.rotation ?? 0) + by) })
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-sm [&_svg:not([class*='size-'])]:size-5"
        aria-label="Rotate left"
        title="Rotate left"
        onClick={() => rotate(-ROTATE_STEP)}
      >
        <Icon icon={RotateCcwIcon} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-sm [&_svg:not([class*='size-'])]:size-5"
        aria-label="Rotate right"
        title="Rotate right"
        onClick={() => rotate(ROTATE_STEP)}
      >
        <Icon icon={RotateCwIcon} />
      </Button>
    </>
  )
}

export {
  STICKERS,
  Sticker,
  StickerImage,
  StickerNode,
  StickerRotateHandle,
  StickerToolbar,
  getSticker,
  normalizeAngle,
}
