import {
  Clapping01Icon,
  FavouriteIcon,
  HelpCircleIcon,
  Idea01Icon,
  LaughingIcon,
  Sad01Icon,
  StarIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import { Icon, type IconSvgElement } from "@/components/icon"
import type { Reaction, ReactionKind, Tag } from "@/canvas/types"
import { githubAvatarUrl } from "@/lib/identity"
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
  heart: {
    label: "Love it",
    icon: FavouriteIcon,
    className: "border-reaction-pink-border bg-reaction-pink text-reaction-pink-border",
  },
  idea: {
    label: "Good idea",
    icon: Idea01Icon,
    className: "border-reaction-blue-border bg-reaction-blue text-reaction-blue-border",
  },
  laugh: {
    label: "Funny",
    icon: LaughingIcon,
    className: "border-reaction-purple-border bg-reaction-purple text-reaction-purple-border",
  },
  clap: {
    label: "Well done",
    icon: Clapping01Icon,
    className: "border-reaction-orange-border bg-reaction-orange text-reaction-orange-border",
  },
  question: {
    label: "Question",
    icon: HelpCircleIcon,
    className: "border-reaction-gray-border bg-reaction-gray text-reaction-gray-border",
  },
}

function placement(item: { x: number; y: number; rotation: number }): React.CSSProperties {
  return {
    left: `${item.x * 100}%`,
    top: `${item.y * 100}%`,
    transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
  }
}

function reactionTitle(reaction: Reaction) {
  const label = REACTIONS[reaction.kind]?.label ?? reaction.kind
  return reaction.by && !reaction.by.startsWith("anon-") ? `${label} from @${reaction.by}` : label
}

function ReactionBadge({ kind, className, ...props }: React.ComponentProps<"span"> & { kind: ReactionKind }) {
  const reaction = REACTIONS[kind]
  if (!reaction) return null
  return (
    <span
      data-slot="reaction-badge"
      title={reaction.label}
      {...props}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border-[1.5px]",
        reaction.className,
        className,
      )}
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
          title={reactionTitle(reaction)}
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

/** The GitHub picture of the person who made a node. Hover to see the name. */
function NodeAuthor({ user, className, ...props }: React.ComponentProps<"img"> & { user: string }) {
  return (
    <img
      data-slot="node-author"
      src={githubAvatarUrl(user, 48)}
      alt={`@${user}`}
      title={`Idea from @${user}`}
      loading="lazy"
      draggable={false}
      className={cn("size-6 rounded-full border-2 border-background bg-muted shadow-flat", className)}
      {...props}
    />
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

export { NodeAuthor, NodeDecorations, ReactionBadge, TagChip }
