import { useSyncExternalStore } from "react"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { BOARD_ID, supabase } from "./supabase"

export type Presence = {
  /** The number of open boards, this one included. */
  count: number
  mode: "live" | "mock"
}

/**
 * Count the people who have the board open, with Supabase Realtime Presence.
 * Each browser tab counts as one person, because there is no login.
 * In mock mode there is no server, so the count is always 1: you.
 *
 * The channel lives outside React. The Supabase client gives back the same
 * channel for the same topic, so a channel for each effect run breaks when
 * React mounts the component two times (StrictMode). Removal waits a moment,
 * so a quick unmount and mount keeps the channel.
 */
export function createPresenceStore(client: SupabaseClient | null) {
  const mode: Presence["mode"] = client ? "live" : "mock"
  const listeners = new Set<() => void>()
  let snapshot: Presence = { count: 1, mode }
  let channel: RealtimeChannel | null = null
  let removeTimer: ReturnType<typeof setTimeout> | undefined

  const setCount = (count: number) => {
    // Count at least 1, because this tab is open even before the first sync.
    snapshot = { count: Math.max(1, count), mode }
    listeners.forEach((listener) => listener())
  }

  const join = (client: SupabaseClient) => {
    const joined = client.channel(`presence:${BOARD_ID}`, {
      config: { presence: { key: crypto.randomUUID() } },
    })
    joined
      .on("presence", { event: "sync" }, () => setCount(Object.keys(joined.presenceState()).length))
      .subscribe((status) => {
        if (status === "SUBSCRIBED") void joined.track({ online_at: new Date().toISOString() })
      })
    return joined
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      clearTimeout(removeTimer)
      if (client && !channel) channel = join(client)

      return () => {
        listeners.delete(listener)
        if (listeners.size > 0) return
        removeTimer = setTimeout(() => {
          if (client && channel) void client.removeChannel(channel)
          channel = null
          snapshot = { count: 1, mode }
        }, 1000)
      }
    },
    getSnapshot: () => snapshot,
  }
}

const boardPresence = createPresenceStore(supabase)

export function usePresence(store = boardPresence): Presence {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}

/** The text for the count, for the tooltip and for screen readers. */
export function presenceLabel({ count, mode }: Presence) {
  if (mode === "mock") return "Mock mode: only you are on this board"
  if (count === 1) return "Only you are on the board"
  return `${count} people are on the board`
}
