import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * The Supabase client, or `null` when `.env.local` has no values.
 * With `null` the app runs in mock mode: data stays in this browser.
 */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

/** All students work on this one board. */
export const BOARD_ID =
  (import.meta.env.VITE_BOARD_ID as string | undefined) ?? "00000000-0000-4000-8000-000000000001"

export const FILES_BUCKET = "board-files"
