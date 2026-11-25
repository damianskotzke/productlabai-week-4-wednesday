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
  /** Show `@[Name]` as a person chip when the person does not type. The saved text stays plain. */
  mentions?: boolean
}

type TextPart = { kind: "text"; text: string } | { kind: "mention"; name: string }

const MENTION = /@\[([^\]\n]+)\]/g

/** Splits text into plain parts and `@[Name]` mentions. */
function splitMentions(text: string): TextPart[] {
  const parts: TextPart[] = []
  let last = 0
  for (const match of text.matchAll(MENTION)) {
    const name = match[1].trim()
    if (!name) continue
    if (match.index > last) parts.push({ kind: "text", text: text.slice(last, match.index) })
    parts.push({ kind: "mention", name })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ kind: "text", text: text.slice(last) })
  return parts
}

/** A person in the text: a round avatar with the first letter, then the name. */
function MentionChip({ name, className, ...props }: React.ComponentProps<"span"> & { name: string }) {
  return (
    <span
      data-slot="mention-chip"
      className={cn(
        "mx-[0.1em] inline-flex items-center gap-[0.25em] rounded-full bg-tint-blue py-[0.1em] pr-[0.45em] pl-[0.1em] align-middle text-[0.7em] leading-none font-medium whitespace-nowrap text-tint-blue-foreground",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="inline-flex size-[1.4em] items-center justify-center rounded-full bg-tint-blue-foreground text-[0.75em] text-tint-blue"
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="sr-only">@</span>
      {name}
    </span>
  )
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
  mentions = false,
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

  const classes = cn(
    "w-full wrap-break-word whitespace-pre-wrap outline-none",
    "empty:before:opacity-50 empty:before:content-[attr(data-placeholder)]",
    editing && "cursor-text select-text",
    className,
  )

  // Show chips only when the person does not type. Then React owns the text.
  if (mentions && !editing) {
    return (
      <div
        key="view"
        data-slot="editable-text"
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-readonly="true"
        aria-label={placeholder ?? "Text"}
        tabIndex={-1}
        className={classes}
        {...props}
      >
        {splitMentions(value).map((part, index) =>
          part.kind === "mention" ? <MentionChip key={index} name={part.name} /> : part.text,
        )}
      </div>
    )
  }

  return (
    <div
      key="edit"
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
      className={classes}
      {...props}
    />
  )
}

export { EditableText, MentionChip, splitMentions }
