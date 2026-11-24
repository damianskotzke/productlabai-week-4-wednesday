import { Sad01Icon, StarIcon, ThumbsUpIcon } from "@hugeicons/core-free-icons"
import { Icon, type IconSvgElement } from "@/components/icon"
import type { Reaction, ReactionKind, Tag } from "@/canvas/types"
import { cn } from "@/lib/utils"

/** Reactions and tags: small items that each node type can have. */

export const REACTIONS: Record<ReactionKind, { label: string; icon: IconSvgElement; className: string }> = {
  "thumbs-up": {
    label: "Thumbs up",
    icon: ThumbsUpIcon,
    className: "border-reaction-green-border bg-reaction-green text-reaction-green-border",
  },
  star: {
    label: "Star",
    icon: StarIcon,
    className: "border-reaction-yellow-border bg-reaction-yellow text-reaction-yellow-border",
  },
  sad: {
    label: "Sad",
    icon: Sad01Icon,
    className: "border-reaction-red-border bg-reaction-red text-reaction-red-border",
  },
}

function placement(item: { x: number; y: number; rotation: number }): React.CSSProperties {
  return {
    left: `${item.x * 100}%`,
    top: `${item.y * 100}%`,
    transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
  }
}

function ReactionBadge({ kind, className, ...props }: React.ComponentProps<"span"> & { kind: ReactionKind }) {
  const reaction = REACTIONS[kind]
  if (!reaction) return null
  return (
    <span
      data-slot="reaction-badge"
      title={reaction.label}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border-[1.5px]",
        reaction.className,
        className,
      )}
      {...props}
    >
      <Icon icon={reaction.icon} className="size-5" />
    </span>
  )
}

function TagChip({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tag-chip"
      className={cn(
        "rounded-sm border bg-background py-1.5 pr-1.5 pl-2 text-xs leading-5 font-medium whitespace-nowrap text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function NodeDecorations({ reactions = [], tags = [] }: { reactions?: Reaction[]; tags?: Tag[] }) {
  return (
    <>
      {reactions.map((reaction, index) => (
        <ReactionBadge
          key={`reaction-${index}`}
          kind={reaction.kind}
          className="pointer-events-none absolute z-10"
          style={placement(reaction)}
        />
      ))}
      {tags.map((tag, index) => (
        <TagChip key={`tag-${index}`} className="pointer-events-none absolute z-10" style={placement(tag)}>
          {tag.text}
        </TagChip>
      ))}
    </>
  )
}

/** A random place on the border of a node, for a new reaction or tag. */
export function randomEdgePlacement(sides: Array<"top" | "right" | "bottom" | "left">) {
  const side = sides[Math.floor(Math.random() * sides.length)]
  const along = 0.15 + Math.random() * 0.7
  const rotation = Math.round((Math.random() * 50 - 25) * 100) / 100
  const point = {
    top: { x: along, y: 0 },
    bottom: { x: along, y: 1 },
    left: { x: 0, y: along },
    right: { x: 1, y: along },
  }[side]
  return { x: Math.round(point.x * 1000) / 1000, y: Math.round(point.y * 1000) / 1000, rotation }
}

export { NodeDecorations, ReactionBadge, TagChip }
