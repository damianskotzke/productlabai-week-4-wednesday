import { useRef, useState } from "react"
import {
  ArrowExpand01Icon,
  ArrowShrink01Icon,
  ImageAdd01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/lib/storage"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

export type ImageData = {
  /** Public URL of the file in the `board-files` storage bucket. Empty before the upload. */
  src: string
  alt: string
  fit: "cover" | "contain"
}

function ImageFrame({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="image-frame"
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-lg border bg-muted shadow-flat transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function ImagePicture({ className, alt, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="image-picture"
      alt={alt}
      draggable={false}
      className={cn("pointer-events-none size-full", className)}
      {...props}
    />
  )
}

/** A button that opens the file dialog and uploads the image to Supabase Storage. */
function ImageUploadButton({
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
    setBusy(true)
    try {
      onUploaded(await uploadFile(file))
    } catch (error) {
      toast.error("Could not upload the image", {
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
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          void onFile(event.target.files?.[0])
          event.target.value = ""
        }}
      />
      <Button
        data-slot="image-upload-button"
        disabled={busy}
        onClick={() => input.current?.click()}
        {...props}
      >
        {busy ? <Icon icon={Loading03Icon} className="animate-spin" /> : <Icon icon={ImageAdd01Icon} />}
        {children}
      </Button>
    </>
  )
}

function ImageNode({ data, updateData }: NodeProps<ImageData>) {
  return (
    <ImageFrame>
      {data.src ? (
        <ImagePicture
          src={data.src}
          alt={data.alt}
          className={data.fit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <ImageUploadButton
          variant="outline"
          size="sm"
          onUploaded={(file) => updateData({ src: file.url, alt: file.name })}
        >
          Choose image
        </ImageUploadButton>
      )}
    </ImageFrame>
  )
}

function ImageToolbar({ data, updateData }: NodeProps<ImageData>) {
  const contain = data.fit === "contain"
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-sm [&_svg:not([class*='size-'])]:size-5"
        aria-label={contain ? "Fill the frame" : "Show the full image"}
        title={contain ? "Fill the frame" : "Show the full image"}
        onClick={() => updateData({ fit: contain ? "cover" : "contain" })}
      >
        {contain ? <Icon icon={ArrowExpand01Icon} /> : <Icon icon={ArrowShrink01Icon} />}
      </Button>
      <ImageUploadButton
        variant="ghost"
        size="icon"
        className="rounded-sm [&_svg:not([class*='size-'])]:size-5"
        aria-label="Replace image"
        title="Replace image"
        onUploaded={(file) => updateData({ src: file.url, alt: file.name })}
      />
    </>
  )
}

export { ImageFrame, ImageNode, ImagePicture, ImageToolbar, ImageUploadButton }
