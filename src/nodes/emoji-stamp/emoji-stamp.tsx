import { BarButton } from "@/components/board/bar"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type EmojiStampData = { emoji: string }

/** The stamps that a person can choose. The first one is the default. */
const STAMPS = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "👎", label: "Thumbs down" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "⭐", label: "Star" },
] as const

/** Old or unknown data gets the default stamp. */
function stampFor(emoji: string | undefined) {
  return STAMPS.find((stamp) => stamp.emoji === emoji) ?? STAMPS[0]
}

/** The emoji fills about 80% of the shorter side of the node. */
function emojiSize(width: number, height: number) {
  return Math.round(Math.min(width, height) * 0.8)
}

function EmojiStamp({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="emoji-stamp"
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-lg border border-transparent transition-colors select-none",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function EmojiStampGlyph({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="emoji-stamp-glyph"
      role="img"
      className={cn("leading-none drop-shadow-sm", className)}
      {...props}
    />
  )
}

/** The component that the board draws. */
function EmojiStampNode({ data, width, height }: NodeProps<EmojiStampData>) {
  const stamp = stampFor(data.emoji)
  return (
    <EmojiStamp>
      <EmojiStampGlyph aria-label={stamp.label} style={{ fontSize: emojiSize(width, height) }}>
        {stamp.emoji}
      </EmojiStampGlyph>
    </EmojiStamp>
  )
}

/** Stamp buttons in the context bar. */
function EmojiStampToolbar({ data, updateData }: NodeProps<EmojiStampData>) {
  const current = stampFor(data.emoji)
  return (
    <>
      {STAMPS.map((stamp) => (
        <BarButton
          key={stamp.emoji}
          label={stamp.label}
          active={stamp.emoji === current.emoji}
          onClick={() => updateData({ emoji: stamp.emoji })}
          className="text-lg"
        >
          {stamp.emoji}
        </BarButton>
      ))}
    </>
  )
}

export { EmojiStamp, EmojiStampGlyph, EmojiStampNode, EmojiStampToolbar, STAMPS, emojiSize }
