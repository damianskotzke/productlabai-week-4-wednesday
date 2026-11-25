import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"
import confusedPhoto from "./photos/confused.jpg"
import excitedPhoto from "./photos/excited.jpg"
import happyPhoto from "./photos/happy.jpg"
import sadPhoto from "./photos/sad.jpg"
import tiredPhoto from "./photos/tired.jpg"

export type GoldenStampMood = "happy" | "confused" | "sad" | "tired" | "excited"
export type GoldenStampData = { mood: GoldenStampMood }

/** The five stamps, in the order of the palette. Photo credits: photos/CREDITS.md. */
const GOLDEN_STAMPS: Array<{ mood: GoldenStampMood; label: string; text: string; photo: string }> = [
  { mood: "happy", label: "Happy golden", text: "Happy", photo: happyPhoto },
  { mood: "confused", label: "Confused golden", text: "Confused", photo: confusedPhoto },
  { mood: "sad", label: "Sad golden", text: "Sad", photo: sadPhoto },
  { mood: "tired", label: "Tired golden", text: "Tired", photo: tiredPhoto },
  { mood: "excited", label: "Excited golden", text: "Excited", photo: excitedPhoto },
]

function findStamp(mood: GoldenStampMood | undefined) {
  return GOLDEN_STAMPS.find((stamp) => stamp.mood === mood) ?? GOLDEN_STAMPS[0]
}

function GoldenStamp({
  className,
  mood,
  ...props
}: Omit<React.ComponentProps<"img">, "src"> & { mood?: GoldenStampMood }) {
  const stamp = findStamp(mood)
  return (
    <img
      data-slot="golden-stamp"
      data-mood={stamp.mood}
      src={stamp.photo}
      alt={stamp.label}
      draggable={false}
      className={cn("aspect-square rounded-full border-2 border-golden-fur object-cover", className)}
      {...props}
    />
  )
}

function GoldenStampText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="golden-stamp-text"
      className={cn("text-sm font-medium text-golden-ink", className)}
      {...props}
    />
  )
}

/** The component that the board draws. */
function GoldenStampNode({ data }: NodeProps<GoldenStampData>) {
  const stamp = findStamp(data.mood)
  return (
    <div
      data-slot="golden-stamp-node"
      className="flex size-full flex-col items-center gap-1 rounded-lg border border-transparent p-1 group-data-selected/node:border-selection group-[:hover:not([data-selected])]/node:border-border"
    >
      <div className="@container-size flex min-h-0 w-full flex-1 items-center justify-center">
        {/* The largest circle that fits in the space. */}
        <GoldenStamp mood={stamp.mood} className="w-[min(100cqw,100cqh)]" />
      </div>
      <GoldenStampText>{stamp.text}</GoldenStampText>
    </div>
  )
}

export { GOLDEN_STAMPS, GoldenStamp, GoldenStampNode, GoldenStampText }
