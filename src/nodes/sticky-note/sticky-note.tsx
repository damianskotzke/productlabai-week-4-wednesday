import { cva, type VariantProps } from "class-variance-authority"
import { ColorPicker, type ColorOption } from "@/components/board/color-picker"
import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type StickyNoteColor = "yellow" | "blue" | "purple" | "red"
export type StickyNoteData = { text: string; color: StickyNoteColor }

const stickyNoteVariants = cva(
  [
    "flex size-full items-center justify-center rounded-[15px] border-[1.5px] px-3 pt-3 pb-6 shadow-note",
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

/** Short text is large. Long text is small, so it stays in the note. */
function sizeForText(text: string): "lg" | "md" | "sm" {
  if (text.length <= 28) return "lg"
  if (text.length <= 72) return "md"
  return "sm"
}

/** The component that the board draws. */
function StickyNoteNode({ data, editing, updateData, stopEditing }: NodeProps<StickyNoteData>) {
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

export { StickyNote, StickyNoteContent, StickyNoteNode, StickyNoteToolbar, stickyNoteVariants }
