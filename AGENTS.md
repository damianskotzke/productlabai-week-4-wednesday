# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor and others) in this repository. Human contributors: read `CONTRIBUTING.md` first.

## What this project is

A small whiteboard that a class of more than 50 people builds together. All people work on **one shared live board** (Supabase). There is no login.

Each person contributes through a GitHub pull request (PR). Most PRs do one of these three tasks:

1. Add a new node type.
2. Improve a node type that a different person made.
3. Change the main UI (top bar, context bar, canvas).

**Your most important goal: keep the PR small and stay in the files of your task.** Fifty people change this repository at the same time. A PR that touches shared files causes merge conflicts for all of them.

## Commands

```bash
pnpm install          # one time
pnpm dev              # start the app: http://localhost:5173
pnpm new:node <name>  # make a new node type from the template (kebab-case name)
pnpm check            # lint + type check + tests + build. Run this before each PR.
pnpm test             # tests only
pnpm format           # Prettier
```

- Board: `http://localhost:5173/`
- Node gallery: `http://localhost:5173/nodes` (each node type alone, good for screenshots)
- Without `.env.local` the app runs in **mock mode**: data stays in the browser. This is sufficient for most node work.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui on **Base UI** (not Radix), zustand, Supabase (Postgres, Realtime, Storage), Vitest, oxlint. Package manager: **pnpm**.

The canvas engine is custom. Do not add React Flow, tldraw, Konva or a different canvas library.

## Project map

```
src/
  nodes/                  ONE FOLDER FOR EACH NODE TYPE  <- most work is here
    define-node.ts        defineNode() and the NodeDefinition / NodeProps types
    registry.ts           finds the node folders automatically. Do not edit.
    registry.test.tsx     the contract that each node must obey. Do not edit.
    _template/            the source for `pnpm new:node`
    sticky-note/  card/  text/  image/
  components/
    board/                main UI: board, top-bar, context-bar, node-shell,
                          editable-text, color-picker, node-decorations, bar
    ui/                   shadcn components. The CLI makes these files.
  canvas/                 the engine: store, geometry, canvas layer, gestures
  lib/                    Supabase client, repository, file upload, cn()
  pages/node-gallery.tsx  the `/nodes` page
supabase/migrations/      SQL schema
supabase/seed-board.json  the start content of the board
```

How the board draws:

- `canvas/canvas-layer.tsx` is one `<canvas>` element. It draws the dotted grid and the connectors with the 2D context.
- `canvas/world-layer.tsx` is a `div` above the canvas with a CSS transform. Each node is an HTML element in it, so a node is a normal React component.
- `components/board/node-shell.tsx` is the frame around each node. It gives position, selection, the four connection dots, the resize grip, reactions and tags. **A node component draws only its content.**

## Task 1: add a new node type

1. Run `pnpm new:node <name>`. Use kebab-case, for example `kanban-card`. Do not copy a folder by hand.
2. Edit only the files in `src/nodes/<name>/`:
   - `<name>.tsx`: the component and its parts.
   - `index.ts`: the definition (label, icon, default size, default data).
   - `<name>.test.tsx`: one or more tests.
3. Open `http://localhost:5173/nodes` and check the node. Then check it on the board.
4. Run `pnpm check`.

**Do not edit `registry.ts`, the top bar, or a list of nodes.** The registry finds `src/nodes/<name>/index.ts` automatically. The node shows in the "More nodes" menu of the top bar.

### Component syntax: the same as shadcn/ui

Write node components in the style of `src/components/ui/*`. Read `src/nodes/sticky-note/sticky-note.tsx` as the example.

- One plain `function` for each part. No `forwardRef`, no default export in the component file.
- Each part has a `data-slot="<name>"` attribute in kebab-case.
- Each part takes `className` and merges it with `cn()` from `@/lib/utils`. Spread `...props` last.
- Type the props with `React.ComponentProps<"div">` (or the element that you use).
- Use `cva` from `class-variance-authority` for variants (colour, size). Export the variants object.
- Name the parts with the node name as prefix: `KanbanCard`, `KanbanCardTitle`, `KanbanCardBadge`.
- Export all parts in one `export { ... }` at the end of the file.
- The last part is `<Name>Node`. It takes `NodeProps<YourData>` and puts the parts together.

```tsx
function KanbanCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kanban-card"
      className={cn("size-full rounded-lg border bg-card p-3 shadow-flat", className)}
      {...props}
    />
  )
}
```

### What the board gives to your node (`NodeProps<Data>`)

| Prop                    | Meaning                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `data`                  | The saved data of this node. Its shape is your `Data` type.                                                         |
| `updateData(patch)`     | Save a change. Give only the changed fields: `updateData({ text })`. The board saves it and sends it to all people. |
| `editing`               | `true` after a double click. Show your edit state then.                                                             |
| `stopEditing()`         | Leave the edit state.                                                                                               |
| `selected`              | `true` when the node is selected.                                                                                   |
| `width`, `height`, `id` | Size on the board, and the node id.                                                                                 |

### Rules for a node

- **Fill the frame.** The root element uses `size-full`. The shell sets the position and the size. Do not use `position: fixed`, and do not set a width or height in pixels on the root.
- **Editable text:** use `<EditableText>` from `@/components/board/editable-text`. Do not make your own `contentEditable`.
- **Selection and hover styles:** the shell sets `group/node` with `data-selected` and `data-editing`. Style with `group-data-selected/node:border-selection` and `group-[:hover:not([data-selected])]/node:...`. Do not draw your own connection dots or resize grip.
- **Buttons and inputs in a node work normally.** A click on a `button`, `input`, `textarea`, `select` or `a` does not start a drag. For a different interactive element, add `data-no-drag`.
- **Data:** only JSON values in `data`. Keep it small. Do not use the names `reactions` and `tags` (the shell owns them). Handle missing fields: a node on the shared board can come from an older version of your code.
- **Files:** use `uploadFile()` from `@/lib/storage`. Save only the URL in `data`. The bucket takes images up to 5 MB. See `src/nodes/image/image.tsx`.
- **A person can change a node to your type** with the first button of the context bar. Your node then gets your `defaultData`, plus the text of the old node for each field that has the same name and an empty-text default (for example `text`). So use the field name `text` for the main text of your node.
- **No new database table or column for a node.** The `data` column is `jsonb`.
- **Context bar controls:** set `toolbar` in the definition. For a colour control, use `<ColorPicker>` from `@/components/board/color-picker`.
- **Do not import from `@/canvas/store` in a node.** Use the props.
- **No network calls** to services other than Supabase, unless the issue asks for it.
- A node must not throw an error with its `defaultData`. The contract test checks this.

### The definition (`index.ts`)

```ts
export default defineNode<KanbanCardData>({
  type: "kanban-card", // kebab-case, the same as the folder name. Never change it after the merge.
  label: "Kanban card",
  description: "One task with a status.",
  icon: KanbanIcon, // from @hugeicons/core-free-icons
  author: "@your-github-handle",
  defaultSize: { width: 240, height: 140 },
  defaultData: { title: "", status: "todo" },
  component: KanbanCardNode,
  // Optional: shortcut, minSize, toolbar, connectable, resizable, editOnCreate
})
```

`shortcut` must be one key that no other node uses. `V`, `T`, `S`, `C` and `I` are taken. Most nodes do not need a shortcut.

## Task 2: improve a node of a different person

- Read the full node folder first. Keep its component names and its `type`.
- **Do not break saved data.** Nodes of this type are on the shared board now. Add new fields as optional and give them a default in the component (`data.status ?? "todo"`). Do not rename or remove a field.
- Keep the change in that one folder. Add or update a test.
- Say in the PR what changed for the person who made the node. They are the best reviewer.

## Task 3: change the main UI

- Files: `src/components/board/*`. Change the smallest number of files.
- Use the shadcn components in `src/components/ui`. If you need a new one, add it with the CLI: `pnpm dlx shadcn@latest add <component>`. Do not write it by hand, and do not edit the files in `components/ui`.
  - The CLI sometimes writes `import { cn } from "cn"`. That is wrong. Change it to `import { cn } from "@/lib/utils"` and do not add the `cn` package.
- This project uses **Base UI**. To make a trigger from a button, use the `render` prop: `<TooltipTrigger render={<Button />}>`. There is no `asChild`.
- Floating UI on the board (bars, popovers, menus, dialogs) needs the attribute `data-board-ui`. Without it, a click on that element also moves the board.
- Bar buttons: use `<BarButton label="...">` from `@/components/board/bar` with an `<Icon>` in it.
- Read and change the board state through `useBoardStore` from `@/canvas/store`. Select one value for each call: `useBoardStore((state) => state.tool)`.

### The canvas engine (`src/canvas`)

Change these files only when the issue is about the engine (for example: pen tool, arrowheads, snap to grid).

- `geometry.ts` has pure functions with tests. Add a test for each new function.
- `canvas-layer.tsx` draws again on each store change. Keep the draw function fast: no React state, no DOM reads in the loop.
- `use-board-gestures.ts` finds its targets with `data-*` attributes (`data-node-id`, `data-handle`, `data-resize`, `data-board-ui`). Keep these names.
- Coordinates: "world" is the board space, "screen" is pixels in the board element. Convert with `toWorld` and `toScreen`.

## Styling rules

- Tailwind classes only. No CSS files for a component, no inline `style` for colours.
- **Use theme tokens, not hex colours.** Good: `bg-note-yellow`, `text-muted-foreground`, `border-selection`. Bad: `bg-[#fefbe0]`.
- The tokens are in `src/index.css`. If you need a new colour, add a token there (`:root` and `@theme inline`) and say so in the PR. This is a shared file, so add your lines at the end of the block.
- Shadows: `shadow-bar` (floating bars), `shadow-note` (stickies), `shadow-flat` (cards).
- Radius: `rounded-lg` is 10 px (cards, bars), `rounded-sm` is 6 px (buttons, tags).
- Icons: **Hugeicons outline** only. Import the icon from `@hugeicons/core-free-icons` and show it with `<Icon icon={Search01Icon} />` from `@/components/icon`. Find the names at <https://hugeicons.com/icons>. Do not add a different icon set. In a node definition, `icon` takes the icon object: `icon: KanbanIcon`.
- The font is Inter. Do not add a font.

## Data and Supabase

- Tables: `wb_boards`, `wb_nodes`, `wb_edges`. Storage bucket: `board-files`.
- `src/lib/board-repository.ts` is the only file that talks to the tables. It has a Supabase version and a mock version. If you change one, change the other.
- **Do not add a migration** unless the issue says so. A migration changes the database of the full class. Never edit a migration that is merged. Add a new file.
- There is no authentication. Do not add login, and do not put secrets in the code. Only the publishable key is in `.env.local`.
- Never delete the nodes of other people on the live board, by hand or with a script.

## Files that you must not change (unless the issue says so)

`src/nodes/registry.ts`, `src/nodes/registry.test.tsx`, `src/nodes/define-node.ts`, `src/components/ui/*`, `src/canvas/*`, `src/lib/*`, `supabase/*`, `.github/*`, `package.json` dependencies, config files in the root.

If your task needs a change in one of these files, stop and tell the user why. The teacher decides.

Do not add a dependency for a node. If you think that you need one, ask the user first.

## Writing style

Write all text (UI labels, comments, commit messages, PR text, docs) in simple English: short sentences, active voice, one meaning for each word, no filler. Keep it friendly.

## Git and PR rules

- **Never commit or push unless the user tells you to.** Show the changes first.
- One issue = one branch = one PR. Branch name: `feat/<issue-number>-<short-name>`, `fix/...` or `docs/...`.
- Never push to `main`. Never force-push a shared branch.
- Commit messages: `feat(sticky-note): add green colour`. The scope is the node name, `board`, `canvas` or `docs`.
- Before a PR, update from `main` (`git pull origin main`), then run `pnpm check`.
- Do not format or "clean up" files that are not part of your task.

## Checklist before you say "done"

- [ ] `pnpm check` passes.
- [ ] The change is only in the files of the task.
- [ ] No hex colours in class names. No new dependency.
- [ ] The node works in the gallery and on the board: create, edit, resize, select, reload.
- [ ] Old data still works (for a change to a node that exists).
- [ ] You told the user what you changed and what you did not test.
