import { cva, type VariantProps } from "class-variance-authority"
import { ColorPicker, type ColorOption } from "@/components/board/color-picker"
import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type StickyNoteColor = "yellow" | "blue" | "purple" | "red"
export type StickyNoteData = { text: string; color: StickyNoteColor }

const stickyNoteVariants = cva(
  [
    "relative flex size-full items-center justify-center rounded-[15px] border-[1.5px] px-3 pt-3 pb-6 shadow-note",
    "bg-linear-165 from-transparent from-40% to-black/2 transition-colors",
    "group-data-selected/node:border-selection",
  ],
  {
    variants: {
      color: {
        yellow:
          "border-note-yellow-border bg-note-yellow text-note-yellow-foreground group-[:hover:not([data-selected])]/node:border-note-yellow-hover group-data-editing/node:border-note-yellow-edit!",
        blue: "border-note-blue-border bg-note-blue text-note-blue-foreground group-[:hover:not([data-selected])]/node:border-note-blue-hover group-data-editing/node:border-note-blue-edit!",
        purple:
          "border-note-purple-border bg-note-purple text-note-purple-foreground group-[:hover:not([data-selected])]/node:border-note-purple-hover group-data-editing/node:border-note-purple-edit!",
        red: "border-note-red-border bg-note-red text-note-red-foreground group-[:hover:not([data-selected])]/node:border-note-red-hover group-data-editing/node:border-note-red-edit!",
      },
    },
    defaultVariants: { color: "yellow" },
  },
)

const stickyNoteContentVariants = cva("text-center", {
  variants: {
    size: {
      lg: "text-4xl leading-[42px]",
      md: "text-3xl leading-9",
      sm: "text-2xl leading-[30px]",
    },
  },
  defaultVariants: { size: "sm" },
})

function StickyNote({
  className,
  color,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof stickyNoteVariants>) {
  return <div data-slot="sticky-note" className={cn(stickyNoteVariants({ color }), className)} {...props} />
}

function StickyNoteContent({
  className,
  size,
  ...props
}: React.ComponentProps<typeof EditableText> & VariantProps<typeof stickyNoteContentVariants>) {
  return (
    <EditableText
      data-slot="sticky-note-content"
      className={cn(stickyNoteContentVariants({ size }), className)}
      {...props}
    />
  )
}

// All lengths are in percent of the edge of the note (pathLength = 100).
const BAND_PART = 100 / 8
const BULB_GAP = 100 / 16

// Red and blue one after the other with no gap. Together they run around the note.
const LIGHTS_BAND = [
  { className: "stroke-lights-red", delay: "[animation-delay:0s]" },
  { className: "stroke-lights-blue", delay: "[animation-delay:-0.2s]" },
]

// 16 bulbs on the wire: red, blue, red, ... When the red bulbs are on, the blue bulbs are off.
const LIGHTS_BULBS = [
  { className: "stroke-lights-red", delay: "[animation-delay:0s]", offset: 0 },
  { className: "stroke-lights-blue", delay: "[animation-delay:-0.25s]", offset: -BULB_GAP },
]

/** One rounded rectangle on the edge of the note. The parts of the lights are made of these. */
function LightsEdge(props: React.ComponentProps<"rect">) {
  return <rect x="0" y="0" width="100%" height="100%" rx="15" pathLength={100} fill="none" {...props} />
}

/**
 * Police lights around the note: a dark wire, a red and blue band that runs, and bulbs that flash.
 * The note shows them when a person selects it or edits it.
 */
function StickyNoteLights({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="sticky-note-lights"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full overflow-visible",
        "drop-shadow-[0_0_6px_var(--color-lights-blue)]",
        className,
      )}
      {...props}
    >
      <LightsEdge strokeWidth={7} className="stroke-lights-wire" />
      {LIGHTS_BAND.map((part) => (
        <LightsEdge
          key={part.className}
          strokeWidth={4}
          strokeDasharray={`${BAND_PART} ${BAND_PART}`}
          className={cn("animate-lights-run motion-reduce:animate-none", part.className, part.delay)}
        />
      ))}
      {LIGHTS_BULBS.map((bulb) => (
        <LightsEdge
          key={bulb.className}
          data-slot="sticky-note-lights-bulbs"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={`0 ${2 * BULB_GAP}`}
          strokeDashoffset={bulb.offset}
          className={cn("animate-lights-flash motion-reduce:animate-none", bulb.className, bulb.delay)}
        />
      ))}
    </svg>
  )
}

/** Short text is large. Long text is small, so it stays in the note. */
function sizeForText(text: string): "lg" | "md" | "sm" {
  if (text.length <= 28) return "lg"
  if (text.length <= 72) return "md"
  return "sm"
}

/** The component that the board draws. */
function StickyNoteNode({ data, selected, editing, updateData, stopEditing }: NodeProps<StickyNoteData>) {
  return (
    <StickyNote color={data.color}>
      <StickyNoteContent
        value={data.text}
        size={sizeForText(data.text)}
        editing={editing}
        placeholder="Write a note"
        onChange={(text) => updateData({ text })}
        onDone={stopEditing}
      />
      {(selected || editing) && <StickyNoteLights />}
    </StickyNote>
  )
}

const COLORS: ColorOption<StickyNoteColor>[] = [
  { value: "yellow", label: "Yellow", className: "border-note-yellow-hover bg-note-yellow" },
  { value: "blue", label: "Blue", className: "border-note-blue-hover bg-note-blue" },
  { value: "purple", label: "Purple", className: "border-note-purple-hover bg-note-purple" },
  { value: "red", label: "Red", className: "border-note-red-hover bg-note-red" },
]

/** Extra controls in the context bar. */
function StickyNoteToolbar({ data, updateData }: NodeProps<StickyNoteData>) {
  return <ColorPicker value={data.color} options={COLORS} onChange={(color) => updateData({ color })} />
}

export {
  StickyNote,
  StickyNoteContent,
  StickyNoteLights,
  StickyNoteNode,
  StickyNoteToolbar,
  stickyNoteVariants,
}
