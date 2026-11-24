import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type TextData = { text: string }

function TextBlock({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="text-block"
      className={cn(
        "min-h-full rounded-xs px-1 py-0.5 text-2xl leading-[30px] text-foreground outline-offset-2",
        "group-[:hover:not([data-selected])]/node:outline group-[:hover:not([data-selected])]/node:outline-edge-dashed",
        "group-data-selected/node:outline-[1.5px] group-data-selected/node:outline-selection",
        className,
      )}
      {...props}
    />
  )
}

function TextNode({ data, editing, updateData, stopEditing }: NodeProps<TextData>) {
  return (
    <TextBlock
      value={data.text}
      editing={editing}
      placeholder="Text"
      onChange={(text) => updateData({ text })}
      onDone={stopEditing}
    />
  )
}

export { TextBlock, TextNode }
