import { EditableText } from "@/components/board/editable-text"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

/**
 * The data that the board saves for this node.
 * Keep it small. Use only JSON values: text, numbers, booleans, lists, objects.
 */
export type TemplateData = { text: string }

/**
 * Presentational parts. Same rules as `src/components/ui`:
 * one function for each part, a `data-slot`, `cn()` for classes, `...props` last.
 * The shell sets `group/node` with `data-selected` and `data-editing`.
 */
function Template({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="template"
      className={cn(
        "flex size-full items-center justify-center rounded-lg border bg-card p-3 text-card-foreground shadow-flat transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function TemplateContent({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="template-content"
      className={cn("text-center text-base", className)}
      {...props}
    />
  )
}

/** The component that the board draws. It gets the saved data in `data`. */
function TemplateNode({ data, editing, updateData, stopEditing }: NodeProps<TemplateData>) {
  return (
    <Template>
      <TemplateContent
        value={data.text}
        editing={editing}
        placeholder="Double-click to edit"
        onChange={(text) => updateData({ text })}
        onDone={stopEditing}
      />
    </Template>
  )
}

export { Template, TemplateContent, TemplateNode }
