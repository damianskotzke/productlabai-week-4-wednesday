import { useRef, useState } from "react"
import { Loading03Icon, PencilEdit01Icon, Search01Icon, Upload01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { uploadFile } from "@/lib/storage"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"
import { libraryGifThumbUrl, libraryGifUrl, searchGifLibrary, toGifUrl } from "./gif-library"

export type GifData = {
  /** A link to the GIF, or the public URL of an uploaded file. Empty before the person adds a GIF. */
  src: string
  alt: string
}

function Gif({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="gif"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border bg-muted p-3 shadow-flat transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function GifPicture({ className, alt, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="gif-picture"
      alt={alt}
      draggable={false}
      className={cn("pointer-events-none size-full object-contain", className)}
      {...props}
    />
  )
}

function GifMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="gif-message"
      className={cn("text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** A field to paste a GIF link. It calls `onAdd` with a checked link. */
function GifLinkForm({
  className,
  onAdd,
  initialValue = "",
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & { onAdd: (url: string) => void; initialValue?: string }) {
  const [value, setValue] = useState(initialValue)
  const [invalid, setInvalid] = useState(false)

  return (
    <form
      data-slot="gif-link-form"
      className={cn("flex w-full max-w-72 gap-1.5", className)}
      onSubmit={(event) => {
        event.preventDefault()
        const url = toGifUrl(value)
        if (!url) {
          setInvalid(true)
          toast.error("This is not a link", { description: "Paste a link that starts with https://" })
          return
        }
        onAdd(url)
      }}
      {...props}
    >
      <Input
        value={value}
        placeholder="Paste a GIF link"
        aria-label="GIF link"
        aria-invalid={invalid || undefined}
        className="bg-background"
        onChange={(event) => {
          setValue(event.target.value)
          setInvalid(false)
        }}
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        Add
      </Button>
    </form>
  )
}

/** A button that opens the file dialog and uploads a GIF to Supabase Storage. */
function GifUploadButton({
  onUploaded,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  onUploaded: (file: { url: string; name: string }) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    if (file.type !== "image/gif") {
      toast.error("This file is not a GIF", { description: "Choose a .gif file up to 5 MB." })
      return
    }
    setBusy(true)
    try {
      onUploaded(await uploadFile(file))
    } catch (error) {
      toast.error("Could not upload the GIF", {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/gif"
        className="hidden"
        onChange={(event) => {
          void onFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />
      <Button data-slot="gif-upload-button" disabled={busy} onClick={() => input.current?.click()} {...props}>
        {busy ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={Upload01Icon} />}
        {children}
      </Button>
    </>
  )
}

/** A search field and a grid of GIFs from the built-in library. */
function GifLibrary({
  className,
  onPick,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & { onPick: (gif: Pick<GifData, "src" | "alt">) => void }) {
  const [query, setQuery] = useState("")
  const results = searchGifLibrary(query)

  return (
    <div data-slot="gif-library" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div className="relative">
        <Icon
          icon={Search01Icon}
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          autoFocus
          value={query}
          placeholder="Search: yes, wow, party, coffee…"
          aria-label="Search GIFs"
          className="pl-8"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {results.length > 0 ? (
        <ul
          aria-label="GIF library"
          className="grid max-h-64 grid-cols-3 gap-1.5 overflow-y-auto overscroll-contain"
        >
          {results.map((gif) => (
            <li key={gif.id}>
              <button
                type="button"
                title={gif.label}
                aria-label={gif.label}
                className="block aspect-square w-full overflow-hidden rounded-sm bg-muted outline-none hover:ring-2 hover:ring-selection focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onPick({ src: libraryGifUrl(gif.id), alt: gif.label })}
              >
                <img
                  src={libraryGifThumbUrl(gif.id)}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <GifMessage className="py-6">
          No GIF for “{query.trim()}”. Try a different word, or paste a link.
        </GifMessage>
      )}
    </div>
  )
}

/** All ways to choose a GIF: the library, a link and an upload. */
function GifPicker({
  onPick,
  initialValue,
}: {
  onPick: (gif: Pick<GifData, "src" | "alt">) => void
  initialValue?: string
}) {
  return (
    <div data-slot="gif-picker" className="flex w-full flex-col items-center gap-2.5">
      <GifLibrary onPick={onPick} />
      <Separator />
      <GifLinkForm
        className="max-w-none"
        initialValue={initialValue}
        onAdd={(src) => onPick({ src, alt: "GIF" })}
      />
      <GifUploadButton
        variant="outline"
        size="sm"
        className="w-full"
        onUploaded={(file) => onPick({ src: file.url, alt: file.name })}
      >
        Upload a .gif
      </GifUploadButton>
    </div>
  )
}

/** A trigger that opens the picker in a popover. The popover closes after a choice. */
function GifPickerPopover({
  trigger,
  children,
  initialValue,
  onPick,
}: {
  trigger: React.ReactElement
  children?: React.ReactNode
  initialValue?: string
  onPick: (gif: Pick<GifData, "src" | "alt">) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger}>{children}</PopoverTrigger>
      <PopoverContent data-board-ui className="w-80">
        <GifPicker
          initialValue={initialValue}
          onPick={(gif) => {
            onPick(gif)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function GifNode({ data, updateData }: NodeProps<GifData>) {
  const src = data.src ?? ""
  // Remember which link failed. A new link clears the message automatically.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (src && failedSrc !== src) {
    return (
      <Gif className="p-0">
        <GifPicture src={src} alt={data.alt ?? "GIF"} onError={() => setFailedSrc(src)} />
      </Gif>
    )
  }

  return (
    <Gif>
      <GifMessage>
        {src
          ? "This link does not show an image. Choose a GIF from the library, or use a direct link to a .gif file."
          : "Choose a GIF from the library, paste a link, or upload a file."}
      </GifMessage>
      <GifPickerPopover initialValue={src} onPick={updateData} trigger={<Button size="sm" />}>
        <Icon icon={Search01Icon} />
        Browse GIFs
      </GifPickerPopover>
    </Gif>
  )
}

function GifToolbar({ data, updateData }: NodeProps<GifData>) {
  return (
    <GifPickerPopover
      initialValue={data.src ?? ""}
      onPick={updateData}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="rounded-sm [&_svg:not([class*='size-'])]:size-5"
          aria-label="Change GIF"
          title="Change GIF"
        />
      }
    >
      <Icon icon={data.src ? PencilEdit01Icon : Search01Icon} />
    </GifPickerPopover>
  )
}

export {
  Gif,
  GifLibrary,
  GifLinkForm,
  GifMessage,
  GifNode,
  GifPicker,
  GifPickerPopover,
  GifPicture,
  GifToolbar,
  GifUploadButton,
}
