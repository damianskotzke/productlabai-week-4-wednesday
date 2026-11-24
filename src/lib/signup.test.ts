import { describe, expect, it } from "vitest"
import { EMAIL_PATTERN, GITHUB_PATTERN, cleanGithubName } from "./signup"

describe("sign-up", () => {
  it("takes the GitHub username from a link or an @name", () => {
    expect(cleanGithubName(" @octocat ")).toBe("octocat")
    expect(cleanGithubName("https://github.com/octocat")).toBe("octocat")
    expect(cleanGithubName("https://github.com/octocat/some-repo")).toBe("octocat")
    expect(cleanGithubName("octocat")).toBe("octocat")
  })

  it("accepts only names that GitHub allows", () => {
    expect(GITHUB_PATTERN.test("octo-cat-1")).toBe(true)
    expect(GITHUB_PATTERN.test("-octocat")).toBe(false)
    expect(GITHUB_PATTERN.test("ada@example.com")).toBe(false)
    expect(GITHUB_PATTERN.test("a".repeat(40))).toBe(false)
  })

  it("checks the shape of an email", () => {
    expect(EMAIL_PATTERN.test("ada@example.com")).toBe(true)
    expect(EMAIL_PATTERN.test("ada@example")).toBe(false)
    expect(EMAIL_PATTERN.test("ada example.com")).toBe(false)
  })
})
