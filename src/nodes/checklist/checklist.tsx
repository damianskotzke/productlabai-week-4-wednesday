import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { useState } from "react"
import { ColorPicker, type ColorOption } from "@/components/board/color-picker"
import { EditableText } from "@/components/board/editable-text"
import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type ChecklistColor = "yellow" | "blue" | "purple" | "red"
export type ChecklistItem = { id: string; text: string; done: boolean }

/**
 * The data that the board saves for this node.
 * `color` and `items` can be missing in old data, so the component gives them a default.
 */
export type ChecklistData = { title: string; color?: ChecklistColor; items?: ChecklistItem[] }

/** The look of a sticky note: the same colours, border, radius and shadow. */
const checklistVariants = cva(
  [
    "flex size-full flex-col gap-3 overflow-hidden rounded-[15px] border-[1.5px] p-4 shadow-note",
    "bg-linear-165 from-transparent from-40% to-black/2 transition-colors",
    "group-data-selected/node:border-selection",
  ],
  {
    variants: {
      color: {
        yellow:
          "border-note-yellow-border bg-note-yellow text-note-yellow-foreground accent-note-yellow-foreground group-[:hover:not([data-selected])]/node:border-note-yellow-hover group-data-editing/node:border-note-yellow-edit!",
        blue: "border-note-blue-border bg-note-blue text-note-blue-foreground accent-note-blue-foreground group-[:hover:not([data-selected])]/node:border-note-blue-hover group-data-editing/node:border-note-blue-edit!",
        purple:
          "border-note-purple-border bg-note-purple text-note-purple-foreground accent-note-purple-foreground group-[:hover:not([data-selected])]/node:border-note-purple-hover group-data-editing/node:border-note-purple-edit!",
        red: "border-note-red-border bg-note-red text-note-red-foreground accent-note-red-foreground group-[:hover:not([data-selected])]/node:border-note-red-hover group-data-editing/node:border-note-red-edit!",
      },
    },
    defaultVariants: { color: "yellow" },
  },
)

function Checklist({
  className,
  color,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof checklistVariants>) {
  return <div data-slot="checklist" className={cn(checklistVariants({ color }), className)} {...props} />
}

function ChecklistTitle({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="checklist-title"
      className={cn("shrink-0 text-2xl leading-[30px] font-semibold", className)}
      {...props}
    />
  )
}

function ChecklistList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="checklist-list"
      className={cn("flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto [scrollbar-width:none]", className)}
      {...props}
    />
  )
}

function ChecklistRow({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="checklist-row"
      className={cn("flex items-center gap-2.5 text-lg leading-7", className)}
      {...props}
    />
  )
}

function ChecklistCheckbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checklist-checkbox"
      className={cn("size-5 shrink-0 cursor-pointer", className)}
      {...props}
    />
  )
}

/** The text of one item. A done item has a line through it and is lighter. */
const checklistItemTextVariants = cva("min-w-0 flex-1 wrap-break-word", {
  variants: {
    done: {
      true: "line-through opacity-50",
      false: "",
    },
  },
  defaultVariants: { done: false },
})

function ChecklistItemText({
  className,
  done,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof checklistItemTextVariants>) {
  return (
    <span
      data-slot="checklist-item-text"
      data-done={done ? "" : undefined}
      className={cn(checklistItemTextVariants({ done }), className)}
      {...props}
    />
  )
}

function ChecklistItemInput({
  className,
  done,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & VariantProps<typeof checklistItemTextVariants>) {
  return (
    <input
      type="text"
      data-slot="checklist-item-input"
      className={cn(
        checklistItemTextVariants({ done }),
        "rounded-sm bg-transparent px-1 outline-none placeholder:text-current placeholder:opacity-50 focus:bg-black/5",
        className,
      )}
      {...props}
    />
  )
}

function ChecklistButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="checklist-button"
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-1 rounded-sm opacity-60 transition-opacity hover:bg-black/5 hover:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

function newItemId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** The component that the board draws. It gets the saved data in `data`. */
function ChecklistNode({ data, editing, updateData }: NodeProps<ChecklistData>) {
  const items = data.items ?? []
  // The id of a new item. Its input gets the focus, so the person can type at once.
  const [focusId, setFocusId] = useState<string | null>(null)

  const setItems = (next: ChecklistItem[]) => updateData({ items: next })
  const changeItem = (id: string, patch: Partial<ChecklistItem>) =>
    setItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  const removeItem = (id: string) => setItems(items.filter((item) => item.id !== id))
  const addItem = (afterIndex = items.length - 1) => {
    const item: ChecklistItem = { id: newItemId(), text: "", done: false }
    setItems([...items.slice(0, afterIndex + 1), item, ...items.slice(afterIndex + 1)])
    setFocusId(item.id)
  }

  return (
    <Checklist color={data.color ?? "yellow"}>
      {/* No onDone: the person moves from the title to the items and stays in the edit state. */}
      <ChecklistTitle
        value={data.title ?? ""}
        editing={editing}
        placeholder="Checklist"
        onChange={(title) => updateData({ title })}
      />
      <ChecklistList>
        {items.map((item, index) => (
          <ChecklistRow key={item.id}>
            <ChecklistCheckbox
              checked={item.done}
              aria-label={item.text || "Item"}
              onChange={(event) => changeItem(item.id, { done: event.currentTarget.checked })}
            />
            {editing ? (
              <>
                <ChecklistItemInput
                  value={item.text}
                  done={item.done}
                  placeholder="New item"
                  aria-label="Item text"
                  autoFocus={item.id === focusId}
                  onChange={(event) => changeItem(item.id, { text: event.currentTarget.value })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addItem(index)
                    }
                  }}
                />
                <ChecklistButton
                  aria-label="Delete item"
                  className="p-0.5"
                  onClick={() => removeItem(item.id)}
                >
                  <Icon icon={Cancel01Icon} className="size-4" />
                </ChecklistButton>
              </>
            ) : (
              <ChecklistItemText done={item.done} className={cn(!item.text && "opacity-50")}>
                {item.text || "New item"}
              </ChecklistItemText>
            )}
          </ChecklistRow>
        ))}
        {/* An empty list still shows a check box, so the node does not look like a plain sticky note. */}
        {!editing && items.length === 0 && (
          <ChecklistRow className="opacity-50">
            <ChecklistCheckbox disabled aria-label="No items" className="cursor-default" />
            <ChecklistItemText>Double-click to add items</ChecklistItemText>
          </ChecklistRow>
        )}
      </ChecklistList>
      {editing && (
        <ChecklistButton className="self-start px-1 py-0.5 text-base" onClick={() => addItem()}>
          <Icon icon={PlusSignIcon} className="size-4" />
          Add item
        </ChecklistButton>
      )}
    </Checklist>
  )
}

const COLORS: ColorOption<ChecklistColor>[] = [
  { value: "yellow", label: "Yellow", className: "border-note-yellow-hover bg-note-yellow" },
  { value: "blue", label: "Blue", className: "border-note-blue-hover bg-note-blue" },
  { value: "purple", label: "Purple", className: "border-note-purple-hover bg-note-purple" },
  { value: "red", label: "Red", className: "border-note-red-hover bg-note-red" },
]

/** Extra controls in the context bar. */
function ChecklistToolbar({ data, updateData }: NodeProps<ChecklistData>) {
  return (
    <ColorPicker
      value={data.color ?? "yellow"}
      options={COLORS}
      onChange={(color) => updateData({ color })}
    />
  )
}

export {
  Checklist,
  ChecklistButton,
  ChecklistCheckbox,
  ChecklistItemInput,
  ChecklistItemText,
  ChecklistList,
  ChecklistNode,
  ChecklistRow,
  ChecklistTitle,
  ChecklistToolbar,
  checklistItemTextVariants,
  checklistVariants,
}
