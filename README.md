# Class Whiteboard

A small whiteboard that we build together in Product Lab AI, week 4. All of us work on one shared live board. Each of us adds to it through a GitHub pull request.

You will learn to branch, commit, pull, open a pull request, review and comment. The product is the excuse.

## Quick start

You need [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io/installation).

```bash
git clone https://github.com/damianskotzke/productlabai-week-4-wednesday.git
cd productlabai-week-4-wednesday
pnpm install
cp .env.example .env.local   # then paste the key from your teacher
pnpm dev
```

Open <http://localhost:5173>.

- With the key in `.env.local`, the board is **live**. You see the board of the class, and the class sees your changes immediately.
- Without the key, the app runs in **mock mode**. The board works, and your changes stay in your browser. This is fine for most work on a node. The browser console tells you when the app is in mock mode.

## How to use the board

| Action            | How                                                          |
| ----------------- | ------------------------------------------------------------ |
| Move the board    | Drag the background, or scroll                               |
| Zoom              | `⌘`/`Ctrl` + scroll. `⌘0` shows the full board               |
| Add a node        | Choose a tool in the top bar, then click the board           |
| Edit a node       | Double-click it                                              |
| Change the type   | Select a node, then use the first button of the bar above it |
| Connect two nodes | Drag one of the four dots to a different node                |
| Resize            | Select a node, then drag its bottom-right corner             |
| Add an image      | Use the Image tool, or drop an image file on the board       |
| Delete            | Select, then `Delete`                                        |

## How to contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md). The short version:

1. Choose an issue and write a comment that you take it.
2. Make a branch.
3. Do the work. For a new node: `pnpm new:node my-node`.
4. Run `pnpm check`.
5. Open a pull request and ask one person for a review.

There are more than 70 ideas in the [issues](https://github.com/damianskotzke/productlabai-week-4-wednesday/issues).

## Work with an AI agent

The file [AGENTS.md](AGENTS.md) tells your agent (Claude Code, Codex, Cursor) how this project works: where a node goes, which syntax to use, and which files it must not change. Claude Code reads it through [CLAUDE.md](CLAUDE.md).

A good first prompt:

> Read issue #12. Make a plan and show it to me before you change a file.

## How it works

- **Vite + React + TypeScript**, **Tailwind CSS v4**, **shadcn/ui** on Base UI.
- **Canvas:** our own small engine in `src/canvas`. One `<canvas>` element draws the grid and the connectors. The nodes are HTML elements above it, so each node is a normal React component.
- **Nodes:** each node type is one folder in `src/nodes`. The app finds the folders automatically. See all nodes at <http://localhost:5173/nodes>.
- **Supabase:** tables `wb_boards`, `wb_nodes`, `wb_edges` (Postgres + Realtime) and the `board-files` bucket (Storage) for images.

There is no login. Each person with the key can change the board, so do not put private data on it.

## Commands

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Start the app                                           |
| `pnpm new:node <name>` | Make a new node type from the template                  |
| `pnpm check`           | Lint, type check, tests and build. The CI runs the same |
| `pnpm test`            | Tests only                                              |
| `pnpm format`          | Format the code with Prettier                           |
