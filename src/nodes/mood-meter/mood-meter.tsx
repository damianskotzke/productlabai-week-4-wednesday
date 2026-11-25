import { HappyIcon, NeutralIcon, Sad02Icon, SadIcon, SmileIcon } from "@hugeicons/core-free-icons"
import { EditableText } from "@/components/board/editable-text"
import { Icon, type IconSvgElement } from "@/components/icon"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

/** 1 is very sad, 5 is very happy. `null` means that no face is selected. */
export type Mood = 1 | 2 | 3 | 4 | 5

export type MoodMeterData = { question: string; mood: Mood | null }

/** The five faces, from sad to happy. */
const MOODS: { value: Mood; label: string; icon: IconSvgElement }[] = [
  { value: 1, label: "Very sad", icon: Sad02Icon },
  { value: 2, label: "Sad", icon: SadIcon },
  { value: 3, label: "Neutral", icon: NeutralIcon },
  { value: 4, label: "Happy", icon: SmileIcon },
  { value: 5, label: "Very happy", icon: HappyIcon },
]

/** Old or broken data can have a different value. Then no face is selected. */
function toMood(value: unknown): Mood | null {
  return MOODS.some((mood) => mood.value === value) ? (value as Mood) : null
}

function MoodMeter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mood-meter"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-flat transition-colors",
        "group-[:hover:not([data-selected])]/node:border-edge-dashed group-data-selected/node:border-selection",
        className,
      )}
      {...props}
    />
  )
}

function MoodMeterQuestion({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="mood-meter-question"
      className={cn("text-center text-base font-medium", className)}
      {...props}
    />
  )
}

function MoodMeterFaces({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mood-meter-faces"
      role="group"
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    />
  )
}

function MoodMeterFace({
  className,
  icon,
  label,
  active = false,
  ...props
}: React.ComponentProps<"button"> & { icon: IconSvgElement; label: string; active?: boolean }) {
  return (
    <button
      type="button"
      data-slot="mood-meter-face"
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-selection",
        "aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <Icon icon={icon} className="size-6" />
    </button>
  )
}

/** The component that the board draws. */
function MoodMeterNode({ data, editing, updateData, stopEditing }: NodeProps<MoodMeterData>) {
  const mood = toMood(data.mood)

  return (
    <MoodMeter>
      <MoodMeterQuestion
        value={data.question ?? ""}
        editing={editing}
        placeholder="How do you feel today?"
        onChange={(question) => updateData({ question })}
        onDone={stopEditing}
      />
      <MoodMeterFaces aria-label="Mood">
        {MOODS.map((option) => (
          <MoodMeterFace
            key={option.value}
            icon={option.icon}
            label={option.label}
            active={option.value === mood}
            // A second click on the selected face clears it.
            onClick={() => updateData({ mood: option.value === mood ? null : option.value })}
          />
        ))}
      </MoodMeterFaces>
    </MoodMeter>
  )
}

export { MoodMeter, MoodMeterFace, MoodMeterFaces, MoodMeterNode, MoodMeterQuestion }
