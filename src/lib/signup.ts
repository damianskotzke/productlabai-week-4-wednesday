/** The Google Apps Script web app of the teacher. It adds a row to a Google Sheet. */
const SIGNUP_URL = import.meta.env.VITE_SIGNUP_URL as string | undefined

export const signupEnabled = Boolean(SIGNUP_URL)

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** GitHub rule: letters, numbers and single hyphens, 39 characters or fewer. */
export const GITHUB_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/

/** Take "octocat" from "@octocat" or "https://github.com/octocat". */
export function cleanGithubName(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/.*$/, "")
}

export type Signup = { email: string; github: string }

/** Send one sign-up to the Google Sheet. Throws an error with a message for the person. */
export async function sendSignup(signup: Signup): Promise<void> {
  if (!SIGNUP_URL) throw new Error("The sign-up form is not connected yet. Tell your teacher.")
  let result: { ok?: boolean; error?: string }
  try {
    // "text/plain" keeps this a simple request, which Apps Script accepts from a browser.
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(signup),
    })
    result = await response.json()
  } catch {
    throw new Error("Could not reach the sign-up sheet. Check your connection and try again.")
  }
  if (result.ok) return
  if (result.error === "email") throw new Error("The email does not look correct.")
  if (result.error === "github") throw new Error("The GitHub username does not look correct.")
  throw new Error("The sign-up sheet gave an error. Try again, or tell your teacher.")
}
