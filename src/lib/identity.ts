import { useSyncExternalStore } from "react"

/**
 * Who uses this browser. There is no login, so a person types their
 * GitHub username once. We keep it in localStorage.
 *
 * Without a username, the browser gets a random id. The board uses it to
 * know which reactions are "mine", so a person can take a reaction back.
 */

const USER_KEY = "wb-github-user"
const BROWSER_KEY = "wb-browser-id"
const listeners = new Set<() => void>()

/** GitHub usernames: letters, numbers and single dashes, at most 39 characters. */
const GITHUB_NAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Private mode: the name is kept only until the page reloads.
  }
}

export function isGithubUsername(value: string) {
  return GITHUB_NAME.test(value)
}

/** The GitHub username of this person, or `null`. */
export function getGithubUser(): string | null {
  const value = read(USER_KEY)
  return value && isGithubUsername(value) ? value : null
}

/** Save the username. An empty or wrong value removes it. Gives back the saved name. */
export function setGithubUser(value: string): string | null {
  const name = value.trim().replace(/^@/, "")
  write(USER_KEY, isGithubUsername(name) ? name : null)
  for (const listener of listeners) listener()
  return getGithubUser()
}

/** The id that marks the reactions of this person: the username, or a random browser id. */
export function getMyId(): string {
  const user = getGithubUser()
  if (user) return user
  let id = read(BROWSER_KEY)
  if (!id) {
    id = `anon-${crypto.randomUUID().slice(0, 8)}`
    write(BROWSER_KEY, id)
  }
  return id
}

/** The picture of a GitHub user. */
export function githubAvatarUrl(user: string, size = 64) {
  return `https://github.com/${encodeURIComponent(user)}.png?size=${size}`
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => event.key === USER_KEY && listener()
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

/** React hook: the GitHub username, updated when it changes. */
export function useGithubUser() {
  return useSyncExternalStore(subscribe, getGithubUser, () => null)
}
