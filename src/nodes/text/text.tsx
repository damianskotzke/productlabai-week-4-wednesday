import { cva, type VariantProps } from "class-variance-authority"
import { ColorPicker, type ColorOption } from "@/components/board/color-picker"
import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

type TextColor = "default" | "muted" | "red"
export type TextData = { text: string; color?: TextColor }

const textBlockVariants = cva(
  [
    "min-h-full rounded-xs px-1 py-0.5 text-2xl leading-[30px] outline-offset-2",
    "group-[:hover:not([data-selected])]/node:outline group-[:hover:not([data-selected])]/node:outline-edge-dashed",
    "group-data-selected/node:outline-[1.5px] group-data-selected/node:outline-selection",
  ],
  {
    variants: {
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        red: "text-destructive",
      },
    },
    defaultVariants: { color: "default" },
  },
)

const COLORS: ColorOption<TextColor>[] = [
  { value: "default", label: "Default", className: "bg-foreground" },
  { value: "muted", label: "Muted", className: "bg-muted-foreground" },
  { value: "red", label: "Red", className: "bg-destructive" },
]

function TextBlock({
  className,
  color,
  ...props
}: Omit<React.ComponentProps<typeof EditableText>, "color"> & VariantProps<typeof textBlockVariants>) {
  return (
    <EditableText data-slot="text-block" className={cn(textBlockVariants({ color }), className)} {...props} />
  )
}

function TextNode({ data, editing, updateData, stopEditing }: NodeProps<TextData>) {
  return (
    <TextBlock
      color={data.color}
      value={data.text}
      editing={editing}
      placeholder="Text"
      onChange={(text) => updateData({ text })}
      onDone={stopEditing}
    />
  )
}

function TextToolbar({ data, updateData }: NodeProps<TextData>) {
  return (
    <ColorPicker
      value={data.color ?? "default"}
      options={COLORS}
      onChange={(color) => updateData({ color })}
    />
  )
}

export { TextBlock, TextNode, TextToolbar, textBlockVariants }
