import { StrictMode } from "react"
import { act, renderHook } from "@testing-library/react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createPresenceStore, presenceLabel, usePresence } from "./use-presence"

/** A fake Supabase client with one presence channel that the test controls. */
function fakeClient() {
  let state: Record<string, unknown[]> = {}
  let onSync = () => {}
  const channel = {
    on: (_type: string, _filter: unknown, callback: () => void) => {
      onSync = callback
      return channel
    },
    subscribe: (callback: (status: string) => void) => {
      callback("SUBSCRIBED")
      return channel
    },
    track: vi.fn(async () => "ok"),
    presenceState: () => state,
  }
  const client = { channel: vi.fn(() => channel), removeChannel: vi.fn(async () => "ok") }
  const sync = (people: number) => {
    state = Object.fromEntries(Array.from({ length: people }, (_, index) => [`tab-${index}`, [{}]]))
    act(() => onSync())
  }
  return { client: client as unknown as SupabaseClient, mock: client, channel, sync }
}

afterEach(() => {
  vi.useRealTimers()
})

describe("usePresence", () => {
  it("shows only you in mock mode", () => {
    const { result } = renderHook(() => usePresence(createPresenceStore(null)))
    expect(result.current).toEqual({ count: 1, mode: "mock" })
  })

  it("counts the people on the board and follows the changes", () => {
    vi.useFakeTimers()
    const fake = fakeClient()
    const store = createPresenceStore(fake.client)
    const { result, unmount } = renderHook(() => usePresence(store))
    expect(fake.channel.track).toHaveBeenCalledOnce()

    fake.sync(3)
    expect(result.current).toEqual({ count: 3, mode: "live" })

    fake.sync(2)
    expect(result.current.count).toBe(2)

    unmount()
    vi.runAllTimers()
    expect(fake.mock.removeChannel).toHaveBeenCalledOnce()
  })

  it("joins one time when React mounts two times", () => {
    vi.useFakeTimers()
    const fake = fakeClient()
    const store = createPresenceStore(fake.client)
    renderHook(() => usePresence(store), { wrapper: StrictMode })
    vi.runAllTimers()
    expect(fake.mock.channel).toHaveBeenCalledOnce()
    expect(fake.mock.removeChannel).not.toHaveBeenCalled()
  })

  it("never shows fewer than 1 person", () => {
    const fake = fakeClient()
    const { result } = renderHook(() => usePresence(createPresenceStore(fake.client)))
    fake.sync(0)
    expect(result.current.count).toBe(1)
  })
})

describe("presenceLabel", () => {
  it("uses simple words for each case", () => {
    expect(presenceLabel({ count: 1, mode: "mock" })).toBe("Mock mode: only you are on this board")
    expect(presenceLabel({ count: 1, mode: "live" })).toBe("Only you are on the board")
    expect(presenceLabel({ count: 4, mode: "live" })).toBe("4 people are on the board")
  })
})
