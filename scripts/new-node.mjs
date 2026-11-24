// Make a new node type from the template: `pnpm new:node kanban-card`
//
// The script copies src/nodes/_template to src/nodes/<name> and renames
// the files and the identifiers. You do not edit a shared file.
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const name = process.argv[2]
if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error("Give a name in kebab-case, for example: pnpm new:node kanban-card")
  process.exit(1)
}
if (name === "template") {
  console.error('"template" is the name of the template. Choose a different name.')
  process.exit(1)
}

const root = new URL("../src/nodes/", import.meta.url).pathname
const source = join(root, "_template")
const target = join(root, name)
if (existsSync(target)) {
  console.error(`src/nodes/${name} exists already. Choose a different name, or improve that node.`)
  process.exit(1)
}

const words = name.split("-")
const pascal = words.map((word) => word[0].toUpperCase() + word.slice(1)).join("")
const label = words
  .map((word, index) => (index === 0 ? word[0].toUpperCase() + word.slice(1) : word))
  .join(" ")

let author = "@your-github-handle"
try {
  const login = execSync("gh api user --jq .login", { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim()
  if (login) author = `@${login}`
} catch {
  // No GitHub CLI: the person writes the handle by hand.
}

const rename = (text) =>
  text
    .replace('label: "Template"', `label: "${label}"`)
    .replaceAll("@your-github-handle", author)
    .replaceAll("Template", pascal)
    .replaceAll("template", name)

mkdirSync(target)
for (const [from, to] of [
  ["template.tsx", `${name}.tsx`],
  ["template.test.tsx", `${name}.test.tsx`],
  ["index.ts", "index.ts"],
]) {
  writeFileSync(join(target, to), rename(readFileSync(join(source, from), "utf8")))
}

console.log(`Made src/nodes/${name}/

  ${name}.tsx        the component (start here)
  index.ts           label, icon, default size and default data
  ${name}.test.tsx   one test

Next steps:
  1. pnpm dev, then open http://localhost:5173/nodes to see your node.
  2. Change the component and the definition.${author === "@your-github-handle" ? "\n  3. Put your GitHub handle in `author` in index.ts." : ""}
  Then run: pnpm check`)
