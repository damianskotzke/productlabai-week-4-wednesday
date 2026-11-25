import { useEffect, useState } from "react"
import { PauseIcon, PlayIcon, RefreshIcon, Timer02Icon } from "@hugeicons/core-free-icons"
import { EditableText } from "@/components/board/editable-text"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { NodeProps } from "../define-node"

/**
 * The timer has three states:
 * - ready:   `endsAt` and `remainingMs` are empty. It shows the full time.
 * - running: `endsAt` is set. Each browser counts "endsAt minus now", so all people see the same time.
 * - paused:  `remainingMs` is set. It shows the time that was left.
 */
export type TomatoTimerData = {
  text: string
  minutes: number
  endsAt: string | null
  remainingMs: number | null
}

export const MINUTE_OPTIONS = [5, 15, 25, 50]
const DEFAULT_MINUTES = 25

/** The length of one block in ms. Old or broken data falls back to 25 minutes. */
function fullMs(data: Partial<TomatoTimerData>): number {
  const minutes = typeof data.minutes === "number" && data.minutes > 0 ? data.minutes : DEFAULT_MINUTES
  return minutes * 60_000
}

/** The time that is left in ms, never below 0. */
function timeLeft(data: Partial<TomatoTimerData>, now: number): number {
  if (data.endsAt) {
    const end = Date.parse(data.endsAt)
    if (!Number.isNaN(end)) return Math.max(0, end - now)
  }
  if (typeof data.remainingMs === "number") return Math.max(0, data.remainingMs)
  return fullMs(data)
}

/** 1 500 000 ms becomes "25:00". Seconds round up, so the timer shows 0:00 only at the end. */
function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/** The current time. It updates a few times each second while `active` is true. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const tick = () => setNow(Date.now())
    // The first tick runs at once, so the time is fresh after a start.
    const first = setTimeout(tick, 0)
    const timer = setInterval(tick, 250)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [active])
  return now
}

function TomatoTimer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tomato-timer"
      className={cn("relative size-full [container-type:size]", className)}
      {...props}
    />
  )
}

/** The green stem and leaf on top of the tomato. */
function TomatoTimerLeaf({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tomato-timer-leaf"
      aria-hidden
      className={cn("absolute top-0 left-1/2 z-10 h-[18%] w-[40%] -translate-x-1/2", className)}
      {...props}
    >
      <div className="absolute top-0 left-1/2 h-1/2 w-[10%] -translate-x-1/2 rounded-full bg-tomato-leaf" />
      <div className="absolute bottom-0 left-0 h-[60%] w-[55%] -rotate-12 rounded-[50%] bg-tomato-leaf" />
      <div className="absolute right-0 bottom-0 h-[60%] w-[55%] rotate-12 rounded-[50%] bg-tomato-leaf" />
    </div>
  )
}

function TomatoTimerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tomato-timer-body"
      className={cn(
        "absolute inset-x-0 top-[10%] bottom-0 flex flex-col items-center justify-center gap-[3cqmin]",
        "rounded-[50%] border-[1.5px] border-black/10 bg-tomato text-tomato-foreground shadow-note",
        "bg-linear-165 from-white/15 from-10% to-black/10 outline-offset-2 transition-colors",
        "group-[:hover:not([data-selected])]/node:outline-2 group-[:hover:not([data-selected])]/node:outline-edge-dashed",
        "group-data-selected/node:outline-2 group-data-selected/node:outline-selection",
        className,
      )}
      {...props}
    />
  )
}

function TomatoTimerLabel({ className, ...props }: React.ComponentProps<typeof EditableText>) {
  return (
    <EditableText
      data-slot="tomato-timer-label"
      className={cn("max-w-[70%] truncate text-center text-[8cqmin] leading-tight font-medium", className)}
      {...props}
    />
  )
}

function TomatoTimerTime({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tomato-timer-time"
      role="timer"
      className={cn("text-[22cqmin] leading-none font-semibold tabular-nums", className)}
      {...props}
    />
  )
}

function TomatoTimerControls({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="tomato-timer-controls" className={cn("flex gap-[3cqmin]", className)} {...props} />
}

function TomatoTimerButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="tomato-timer-button"
      type="button"
      className={cn(
        "flex size-[15cqmin] min-h-6 min-w-6 items-center justify-center rounded-full",
        "bg-white/20 text-tomato-foreground transition-colors hover:bg-white/30",
        "[&_svg]:size-[60%]",
        className,
      )}
      {...props}
    />
  )
}

/** The component that the board draws. */
function TomatoTimerNode({ data, editing, updateData, stopEditing }: NodeProps<TomatoTimerData>) {
  const running = Boolean(data.endsAt)
  const now = useNow(running)
  const left = timeLeft(data, now)
  const done = running && left === 0

  function start() {
    // After "Time's up!" a start begins a new full block.
    const from = left > 0 ? left : fullMs(data)
    updateData({ endsAt: new Date(Date.now() + from).toISOString(), remainingMs: null })
  }

  function pause() {
    updateData({ endsAt: null, remainingMs: timeLeft(data, Date.now()) })
  }

  function reset() {
    updateData({ endsAt: null, remainingMs: null })
  }

  return (
    <TomatoTimer>
      <TomatoTimerLeaf />
      <TomatoTimerBody className={cn(done && "animate-pulse")}>
        <TomatoTimerLabel
          value={data.text ?? ""}
          editing={editing}
          placeholder="Focus"
          onChange={(text) => updateData({ text })}
          onDone={stopEditing}
        />
        <TomatoTimerTime>{done ? "Time's up!" : formatTime(left)}</TomatoTimerTime>
        <TomatoTimerControls>
          {running && !done ? (
            <TomatoTimerButton aria-label="Pause" title="Pause" onClick={pause}>
              <Icon icon={PauseIcon} />
            </TomatoTimerButton>
          ) : (
            <TomatoTimerButton aria-label="Start" title="Start" onClick={start}>
              <Icon icon={PlayIcon} />
            </TomatoTimerButton>
          )}
          <TomatoTimerButton aria-label="Reset" title="Reset" onClick={reset}>
            <Icon icon={RefreshIcon} />
          </TomatoTimerButton>
        </TomatoTimerControls>
      </TomatoTimerBody>
    </TomatoTimer>
  )
}

/** The length choice in the context bar. A new length resets the timer. */
function TomatoTimerToolbar({ data, updateData }: NodeProps<TomatoTimerData>) {
  const current = fullMs(data) / 60_000
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            data-slot="tomato-timer-length"
            variant="ghost"
            size="sm"
            aria-label="Length"
            title="Length"
            className="rounded-sm text-foreground"
          />
        }
      >
        <Icon icon={Timer02Icon} />
        {current} min
      </PopoverTrigger>
      <PopoverContent data-board-ui side="top" sideOffset={12} className="w-auto flex-row gap-1 p-1">
        {MINUTE_OPTIONS.map((minutes) => (
          <Button
            key={minutes}
            variant="ghost"
            size="sm"
            aria-pressed={minutes === current}
            onClick={() => updateData({ minutes, endsAt: null, remainingMs: null })}
            className="rounded-sm aria-pressed:bg-muted"
          >
            {minutes} min
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export {
  TomatoTimer,
  TomatoTimerBody,
  TomatoTimerButton,
  TomatoTimerControls,
  TomatoTimerLabel,
  TomatoTimerLeaf,
  TomatoTimerNode,
  TomatoTimerTime,
  TomatoTimerToolbar,
  formatTime,
  timeLeft,
}
