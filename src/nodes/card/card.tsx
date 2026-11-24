import { cva, type VariantProps } from "class-variance-authority"
import { ColorPicker, type ColorOption } from "@/components/board/color-picker"
import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type FlowCardColor = "white" | "blue" | "green"
export type FlowCardData = { text: string; color: FlowCardColor }

const flowCardFaceVariants = cva(
  "flex size-full items-center justify-center overflow-hidden rounded-lg border-3 border-background px-3 pt-3 pb-4",
  {
    variants: {
      color: {
        white: "bg-background text-foreground",
        blue: "bg-tint-blue text-tint-blue-foreground",
        green: "bg-tint-green text-tint-green-foreground",
      },
    },
    defaultVariants: { color: "white" },
  },
)

function FlowCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="flow-card"
      className={cn(
        "size-full rounded-lg border bg-background shadow-flat transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed",
        "group-data-selected/node:border-selection group-data-editing/node:border-ring!",
        className,
      )}
      {...props}
    />
  )
}

function FlowCardFace({
  className,
  color,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof flowCardFaceVariants>) {
  return (
    <div data-slot="flow-card-face" className={cn(flowCardFaceVariants({ color }), className)} {...props} />
  )
}

function FlowCardTitle({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="flow-card-title"
      className={cn("text-center text-2xl leading-7", className)}
      {...props}
    />
  )
}

function FlowCardNode({ data, editing, updateData, stopEditing }: NodeProps<FlowCardData>) {
  return (
    <FlowCard>
      <FlowCardFace color={data.color}>
        <FlowCardTitle
          value={data.text}
          editing={editing}
          placeholder="Step name"
          onChange={(text) => updateData({ text })}
          onDone={stopEditing}
        />
      </FlowCardFace>
    </FlowCard>
  )
}

const COLORS: ColorOption<FlowCardColor>[] = [
  { value: "white", label: "White", className: "bg-background" },
  { value: "blue", label: "Blue", className: "bg-tint-blue" },
  { value: "green", label: "Green", className: "bg-tint-green" },
]

function FlowCardToolbar({ data, updateData }: NodeProps<FlowCardData>) {
  return <ColorPicker value={data.color} options={COLORS} onChange={(color) => updateData({ color })} />
}

export { FlowCard, FlowCardFace, FlowCardNode, FlowCardTitle, FlowCardToolbar, flowCardFaceVariants }
