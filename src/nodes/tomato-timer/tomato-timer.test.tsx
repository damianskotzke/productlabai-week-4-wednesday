import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TomatoTimerNode, formatTime, timeLeft, type TomatoTimerData } from "./tomato-timer"

const NOW = new Date("2026-01-01T10:00:00.000Z").getTime()

function renderTimer(data: Partial<TomatoTimerData>, updateData = vi.fn()) {
  render(
    <TomatoTimerNode
      id="1"
      data={{ text: "Focus", minutes: 25, endsAt: null, remainingMs: null, ...data }}
      width={200}
      height={200}
      selected={false}
      editing={false}
      updateData={updateData}
      stopEditing={vi.fn()}
    />,
  )
  return updateData
}

describe("formatTime", () => {
  it("shows minutes and seconds", () => {
    expect(formatTime(25 * 60_000)).toBe("25:00")
    expect(formatTime(65_000)).toBe("1:05")
    expect(formatTime(0)).toBe("0:00")
  })

  it("rounds the seconds up", () => {
    expect(formatTime(59_001)).toBe("1:00")
  })
})

describe("timeLeft", () => {
  it("uses the full length when the timer is ready", () => {
    expect(timeLeft({ minutes: 5, endsAt: null, remainingMs: null }, NOW)).toBe(5 * 60_000)
  })

  it("counts down to endsAt and stops at 0", () => {
    const endsAt = new Date(NOW + 90_000).toISOString()
    expect(timeLeft({ endsAt }, NOW)).toBe(90_000)
    expect(timeLeft({ endsAt }, NOW + 200_000)).toBe(0)
  })

  it("handles missing or broken data", () => {
    expect(timeLeft({}, NOW)).toBe(25 * 60_000)
    expect(timeLeft({ minutes: -3, endsAt: "not a date" }, NOW)).toBe(25 * 60_000)
  })
})

describe("TomatoTimerNode", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("shows the label and the full time", () => {
    renderTimer({ text: "Deep work", minutes: 15 })
    expect(screen.getByRole("textbox")).toHaveTextContent("Deep work")
    expect(screen.getByRole("timer")).toHaveTextContent("15:00")
  })

  it("saves an end time on start", () => {
    const updateData = renderTimer({ minutes: 25 })
    fireEvent.click(screen.getByRole("button", { name: "Start" }))
    expect(updateData).toHaveBeenCalledWith({
      endsAt: new Date(NOW + 25 * 60_000).toISOString(),
      remainingMs: null,
    })
  })

  it("saves the time left on pause", () => {
    const updateData = renderTimer({ endsAt: new Date(NOW + 60_000).toISOString() })
    fireEvent.click(screen.getByRole("button", { name: "Pause" }))
    expect(updateData).toHaveBeenCalledWith({ endsAt: null, remainingMs: 60_000 })
  })

  it("shows the paused time", () => {
    renderTimer({ remainingMs: 125_000 })
    expect(screen.getByRole("timer")).toHaveTextContent("2:05")
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument()
  })

  it("clears the state on reset", () => {
    const updateData = renderTimer({ remainingMs: 125_000 })
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(updateData).toHaveBeenCalledWith({ endsAt: null, remainingMs: null })
  })

  it("shows a clear state when the time is over", () => {
    renderTimer({ endsAt: new Date(NOW - 1000).toISOString() })
    expect(screen.getByRole("timer")).toHaveTextContent("Time's up!")
  })
})
