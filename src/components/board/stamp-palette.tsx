import { useEffect, useState } from "react"
import { PawPrintIcon } from "@hugeicons/core-free-icons"
import { toWorld } from "@/canvas/geometry"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { GOLDEN_STAMPS, GoldenStamp, type GoldenStampMood } from "@/nodes/golden-stamp/golden-stamp"
import { Bar } from "./bar"

const STAMP_TOOL = "golden-stamp"

/** The floating stamp button at the bottom of the board. Choose a stamp, then click the board. */
function StampPalette() {
  const active = useBoardStore((state) => state.tool === STAMP_TOOL)
  const setTool = useBoardStore((state) => state.setTool)
  const [open, setOpen] = useState(false)
  const [mood, setMood] = useState<GoldenStampMood>("happy")

  // A tool is only a node type, so the board does not know the mood.
  // Take the click before the board does, and make the node with the mood.
  useEffect(() => {
    if (!active) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element
      const board = target.closest<HTMLElement>('[data-slot="board"]')
      if (!board || event.button !== 0 || board.dataset.space) return
      if (target.closest("[data-board-ui]")) return
      event.stopPropagation()
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      const rect = board.getBoundingClientRect()
      const state = useBoardStore.getState()
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      state.addNode(STAMP_TOOL, toWorld(state.view, point), { mood })
    }
    window.addEventListener("pointerdown", onPointerDown, { capture: true })
    return () => window.removeEventListener("pointerdown", onPointerDown, { capture: true })
  }, [active, mood])

  return (
    <Bar data-slot="stamp-palette" className="bottom-4 left-1/2 -translate-x-1/2 rounded-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Golden stamps"
              title="Golden stamps"
              data-active={active || undefined}
              className="size-16 rounded-full bg-golden-fur text-golden-ink hover:bg-golden-ear aria-expanded:bg-golden-ear data-active:bg-golden-ear data-active:ring-2 data-active:ring-selection"
            />
          }
        >
          <Icon icon={PawPrintIcon} className="size-9" />
        </PopoverTrigger>
        <PopoverContent data-board-ui side="top" sideOffset={12} className="w-auto flex-row gap-1 p-1.5">
          {GOLDEN_STAMPS.map((stamp) => {
            const chosen = active && stamp.mood === mood
            return (
              <Button
                key={stamp.mood}
                variant="ghost"
                aria-label={stamp.label}
                title={stamp.label}
                aria-pressed={chosen}
                className="h-auto w-20 flex-col gap-1 rounded-sm p-1.5 aria-pressed:bg-muted"
                onClick={() => {
                  setMood(stamp.mood)
                  setTool(chosen ? SELECT_TOOL : STAMP_TOOL)
                  setOpen(false)
                }}
              >
                <GoldenStamp mood={stamp.mood} alt="" className="size-16" />
                <span className="text-xs">{stamp.text}</span>
              </Button>
            )
          })}
        </PopoverContent>
      </Popover>
    </Bar>
  )
}

export { StampPalette }
