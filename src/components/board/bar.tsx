import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** Shared parts of the floating bars (top bar and context bar). */

function Bar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bar"
      data-board-ui
      className={cn(
        "absolute z-40 flex cursor-default items-center rounded-lg border bg-background shadow-bar",
        className,
      )}
      {...props}
    />
  )
}

function BarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="bar-group" className={cn("flex items-center gap-1 p-1", className)} {...props} />
}

function BarSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="bar-separator" className={cn("w-px self-stretch bg-border", className)} {...props} />
}

type BarButtonProps = React.ComponentProps<typeof Button> & {
  /** Text for the tooltip and for screen readers. */
  label: string
  shortcut?: string
  active?: boolean
}

/** A 32 px icon button with a tooltip. Put an `<Icon>` in it. */
function BarButton({ label, shortcut, active, className, children, ...props }: BarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="bar-button"
            data-active={active || undefined}
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-pressed={active}
            className={cn(
              "rounded-sm text-foreground [&_svg:not([class*='size-'])]:size-5",
              "data-active:border-border data-active:bg-muted data-active:shadow-flat",
              className,
            )}
            {...props}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {label}
        {shortcut && <kbd className="font-sans opacity-60">{shortcut}</kbd>}
      </TooltipContent>
    </Tooltip>
  )
}

export { Bar, BarButton, BarGroup, BarSeparator }
