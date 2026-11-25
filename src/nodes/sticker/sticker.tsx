import { useState } from "react"
import { StickerIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"
import { STICKERS, findSticker, type StickerId } from "./stickers"

export type StickerData = { sticker: StickerId }

function Sticker({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticker"
      className={cn(
        "size-full rounded-lg border border-transparent transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function StickerPicture({ className, alt, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="sticker-picture"
      alt={alt}
      draggable={false}
      className={cn("pointer-events-none size-full object-contain drop-shadow-md", className)}
      {...props}
    />
  )
}

/** The grid with all stickers. */
function StickerPicker({
  className,
  value,
  onPick,
  ...props
}: React.ComponentProps<"div"> & { value: StickerId; onPick: (sticker: StickerId) => void }) {
  return (
    <div
      data-slot="sticker-picker"
      role="group"
      aria-label="Stickers"
      className={cn("grid grid-cols-4 gap-1", className)}
      {...props}
    >
      {STICKERS.map((sticker) => (
        <button
          key={sticker.id}
          type="button"
          aria-label={sticker.label}
          title={sticker.label}
          aria-pressed={sticker.id === value}
          onClick={() => onPick(sticker.id)}
          className="size-14 rounded-sm p-1 outline-selection hover:bg-muted focus-visible:outline-2 aria-pressed:bg-muted aria-pressed:outline-2"
        >
          <StickerPicture src={sticker.src} alt="" className="drop-shadow-sm" />
        </button>
      ))}
    </div>
  )
}

/** The component that the board draws. */
function StickerNode({ data }: NodeProps<StickerData>) {
  const sticker = findSticker(data.sticker)
  return (
    <Sticker>
      <StickerPicture src={sticker.src} alt={`${sticker.label} sticker`} />
    </Sticker>
  )
}

/** The context bar button. A double click on the sticker opens the picker too. */
function StickerToolbar({ data, editing, updateData, stopEditing }: NodeProps<StickerData>) {
  const [open, setOpen] = useState(false)

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next && editing) stopEditing()
  }

  return (
    <Popover open={open || editing} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            data-slot="sticker-toolbar"
            variant="ghost"
            size="icon"
            aria-label="Choose sticker"
            title="Choose sticker"
            className="rounded-sm text-foreground [&_svg:not([class*='size-'])]:size-5"
          />
        }
      >
        <Icon icon={StickerIcon} />
      </PopoverTrigger>
      <PopoverContent
        data-board-ui
        side="top"
        sideOffset={12}
        className="max-h-(--available-height) w-auto overflow-y-auto p-2"
      >
        <StickerPicker
          value={findSticker(data.sticker).id}
          onPick={(sticker) => {
            updateData({ sticker })
            onOpenChange(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { Sticker, StickerNode, StickerPicker, StickerPicture, StickerToolbar }
