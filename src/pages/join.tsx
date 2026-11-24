import { useState } from "react"
import { CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EMAIL_PATTERN, GITHUB_PATTERN, cleanGithubName, sendSignup, signupEnabled } from "@/lib/signup"

type Status = "idle" | "sending" | "done"

/**
 * `/join`: a student gives an email and a GitHub username.
 * The teacher uses the list to invite the class to the repository.
 */
function JoinPage() {
  const [email, setEmail] = useState("")
  const [github, setGithub] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Bots fill in each field. People do not see this one.
    const trap = new FormData(event.currentTarget).get("website")
    const cleanEmail = email.trim()
    const cleanGithub = cleanGithubName(github)
    if (!EMAIL_PATTERN.test(cleanEmail))
      return setError("Write a correct email, for example ada@example.com.")
    if (!GITHUB_PATTERN.test(cleanGithub)) {
      return setError("Write your GitHub username, for example octocat. It is not your email.")
    }
    setError("")
    setStatus("sending")
    try {
      if (!trap) await sendSignup({ email: cleanEmail, github: cleanGithub })
      setGithub(cleanGithub)
      setStatus("done")
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Something went wrong. Try again.")
      setStatus("idle")
    }
  }

  return (
    <main
      data-slot="join-page"
      className="flex h-full items-center justify-center overflow-auto bg-muted/40 p-4"
    >
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-xl border bg-background p-6 shadow-flat">
        {status === "done" ? (
          <div className="flex flex-col gap-3" role="status">
            <Icon icon={CheckmarkCircle02Icon} className="size-8 text-reaction-green-border" />
            <h1 className="text-xl font-medium">You are on the list</h1>
            <p className="text-sm text-muted-foreground">
              Your teacher will invite <strong className="font-medium text-foreground">{github}</strong> to
              the repository. GitHub sends the invitation to your email. Accept it before the lesson.
            </p>
            <p className="text-sm text-muted-foreground">
              A mistake? Send the form again with the same email, and the new GitHub username replaces the old
              one.
            </p>
            <Button variant="outline" className="self-start" onClick={() => setStatus("idle")}>
              Change my answer
            </Button>
          </div>
        ) : (
          <>
            <header className="flex flex-col gap-1.5">
              <h1 className="text-xl font-medium">Join the class repository</h1>
              <p className="text-sm text-muted-foreground">
                Your teacher needs these two things to give you access on GitHub. Only your teacher sees them.
              </p>
            </header>

            <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="join-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="join-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ada@example.com"
                  maxLength={200}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="join-github" className="text-sm font-medium">
                  GitHub username
                </label>
                <Input
                  id="join-github"
                  name="github"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="octocat"
                  maxLength={80}
                  required
                  aria-describedby="join-github-hint"
                  value={github}
                  onChange={(event) => setGithub(event.target.value)}
                />
                <p id="join-github-hint" className="text-xs text-muted-foreground">
                  The name in the link of your profile: github.com/
                  <strong className="font-medium">octocat</strong>. No account yet?{" "}
                  <a
                    href="https://github.com/signup"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    Make one
                  </a>
                  .
                </p>
              </div>

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {!signupEnabled && (
                <p className="text-sm text-muted-foreground">
                  The form is not connected to the sheet yet (no <code>VITE_SIGNUP_URL</code>).
                </p>
              )}

              <Button type="submit" disabled={status === "sending" || !signupEnabled}>
                {status === "sending" && <Icon icon={Loading03Icon} className="animate-spin" />}
                {status === "sending" ? "Sending…" : "Send"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

export { JoinPage }
