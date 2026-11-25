import { beforeEach, describe, expect, it } from "vitest"
import { getGithubUser, getMyId, isGithubUsername, setGithubUser } from "./identity"

describe("identity", () => {
  beforeEach(() => localStorage.clear())

  it("checks GitHub usernames", () => {
    expect(isGithubUsername("octocat")).toBe(true)
    expect(isGithubUsername("Jusia-Jk")).toBe(true)
    expect(isGithubUsername("-bad")).toBe(false)
    expect(isGithubUsername("two--dashes")).toBe(false)
    expect(isGithubUsername("has space")).toBe(false)
  })

  it("saves a name and removes the @", () => {
    expect(setGithubUser(" @octocat ")).toBe("octocat")
    expect(getGithubUser()).toBe("octocat")
    expect(getMyId()).toBe("octocat")
  })

  it("gives a stable browser id without a name", () => {
    expect(setGithubUser("not valid!")).toBeNull()
    const id = getMyId()
    expect(id).toMatch(/^anon-/)
    expect(getMyId()).toBe(id)
  })
})
