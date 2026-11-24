// Create the starter issues on GitHub from docs/starter-issues.md.
//
//   node scripts/create-issues.mjs         preview: print the titles
//   node scripts/create-issues.mjs --yes   create the labels and the issues
//
// You need the GitHub CLI (`gh`) and write access to the repository.
// Run it one time only: a second run makes each issue again.
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const create = process.argv.includes("--yes")
const text = readFileSync(new URL("../docs/starter-issues.md", import.meta.url), "utf8")

const issues = text
  .split(/^### /m)
  .slice(1)
  .map((block) => {
    const [title, ...rest] = block.split("\n")
    const lines = rest.join("\n").split(/^## /m)[0].trim().split("\n")
    const labelLine = lines.find((line) => line.startsWith("Labels:")) ?? "Labels:"
    return {
      title: title.trim(),
      labels: labelLine
        .replace("Labels:", "")
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      body: lines
        .filter((line) => line !== labelLine)
        .join("\n")
        .trim(),
    }
  })

const LABELS = {
  "new-node": ["0e8a16", "Add a new node type"],
  "improve-node": ["1d76db", "Improve a node that exists"],
  "main-ui": ["5319e7", "Top bar, context bar, canvas or a page"],
  quality: ["c5def5", "Tests and documents"],
  easy: ["c2e0c6", "A good first pull request"],
  medium: ["fef2c0", "Some logic, or two or three files"],
  hard: ["f9d0c4", "Touches the engine or the data"],
  bug: ["d73a4a", "Something does not work"],
}

console.log(`${issues.length} issues in docs/starter-issues.md\n`)
for (const issue of issues) console.log(`  [${issue.labels.join(", ")}] ${issue.title}`)

if (!create) {
  console.log("\nThis was a preview. Add --yes to create the issues on GitHub.")
  process.exit(0)
}

for (const [name, [color, description]] of Object.entries(LABELS)) {
  execFileSync("gh", ["label", "create", name, "--color", color, "--description", description, "--force"], {
    stdio: "inherit",
  })
}
for (const issue of issues) {
  execFileSync(
    "gh",
    [
      "issue",
      "create",
      "--title",
      issue.title,
      "--body",
      issue.body,
      ...issue.labels.flatMap((label) => ["--label", label]),
    ],
    { stdio: "inherit" },
  )
}
console.log(`\nDone. Created ${issues.length} issues.`)
