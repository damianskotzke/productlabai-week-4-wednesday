import { useEffect, useLayoutEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type EditableTextProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  value: string
  /** True when the person can type. The board sets this after a double click. */
  editing: boolean
  onChange: (value: string) => void
  /** Called when the person leaves the field. */
  onDone?: () => void
  placeholder?: string
}

/**
 * Plain text that a person can edit in place.
 * Use it in a node for each text that must be editable.
 */
function EditableText({
  value,
  editing,
  onChange,
  onDone,
  placeholder,
  className,
  ...props
}: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  // React does not own the text of this element, or the caret would jump.
  // Write the text only when the person does not type in it.
  useLayoutEffect(() => {
    const element = ref.current
    if (!element || document.activeElement === element) return
    if (element.textContent !== value) element.textContent = value
  }, [value, editing])

  useEffect(() => {
    const element = ref.current
    if (!editing || !element) return
    element.focus()
    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [editing])

  return (
    <div
      ref={ref}
      data-slot="editable-text"
      data-placeholder={placeholder}
      role="textbox"
      aria-multiline="true"
      aria-label={placeholder ?? "Text"}
      tabIndex={editing ? 0 : -1}
      contentEditable={editing ? "plaintext-only" : false}
      suppressContentEditableWarning
      onInput={(event) => onChange(event.currentTarget.textContent ?? "")}
      onBlur={onDone}
      className={cn(
        "w-full wrap-break-word whitespace-pre-wrap outline-none",
        "empty:before:opacity-50 empty:before:content-[attr(data-placeholder)]",
        editing && "cursor-text select-text",
        className,
      )}
      {...props}
    />
  )
}

export { EditableText }
