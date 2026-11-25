import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

/** A red dot has no saved data. */
export type RedDotData = Record<string, never>

/** The red dot. It fills the frame and stays round. */
function RedDot({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="red-dot"
      className={cn(
        "size-full rounded-full bg-destructive transition-shadow",
        "group-data-selected/node:ring-2 group-data-selected/node:ring-selection group-data-selected/node:ring-offset-2",
        className,
      )}
      {...props}
    />
  )
}

/** The component that the board draws. */
function RedDotNode(_props: NodeProps<RedDotData>) {
  return <RedDot role="img" aria-label="Red dot" />
}

export { RedDot, RedDotNode }
