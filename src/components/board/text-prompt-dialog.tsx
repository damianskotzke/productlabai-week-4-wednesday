import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type TextPromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  placeholder?: string
  initialValue?: string
  submitLabel?: string
  onSubmit: (value: string) => void
}

/** A small dialog that asks for one line of text. */
function TextPromptDialog({ open, onOpenChange, ...props }: TextPromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-board-ui className="sm:max-w-sm">
        {/* The form mounts each time the dialog opens, so it starts with the current value. */}
        <TextPromptForm onOpenChange={onOpenChange} {...props} />
      </DialogContent>
    </Dialog>
  )
}

function TextPromptForm({
  onOpenChange,
  title,
  description,
  placeholder,
  initialValue = "",
  submitLabel = "Save",
  onSubmit,
}: Omit<TextPromptDialogProps, "open">) {
  const [value, setValue] = useState(initialValue)
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim()) return
        onSubmit(value.trim())
        onOpenChange(false)
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <Input
        autoFocus
        value={value}
        placeholder={placeholder}
        aria-label={title}
        maxLength={60}
        onChange={(event) => setValue(event.target.value)}
      />
      <DialogFooter>
        <Button type="submit" disabled={!value.trim()}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

export { TextPromptDialog }
