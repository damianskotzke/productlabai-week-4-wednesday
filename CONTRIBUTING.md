# How to contribute

Welcome. This guide takes you from "I have the repository" to "my change is on the board of the class". Go step by step. If a step fails, ask: a wrong Git command is normal, and we can repair almost all of them.

## The flow

```
issue  ->  branch  ->  commits  ->  pull request  ->  review  ->  merge
```

## 0. One time: get the project

```bash
git clone https://github.com/damianskotzke/productlabai-week-4-wednesday.git
cd productlabai-week-4-wednesday
pnpm install
cp .env.example .env.local    # paste the key from your teacher
pnpm dev
```

## 1. Choose an issue

Open the **Issues** tab on GitHub and choose one. There are three types:

| Label          | The task                                          | Where you work                           |
| -------------- | ------------------------------------------------- | ---------------------------------------- |
| `new-node`     | Add a new node type                               | A new folder in `src/nodes/`             |
| `improve-node` | Improve a node of a different person              | One folder in `src/nodes/`               |
| `main-ui`      | Change the top bar, the context bar or the canvas | `src/components/board/` or `src/canvas/` |

Write a comment on the issue: "I take this." Then all people know that it is yours. One person for each issue.

No issue for your idea? Make one first, with the issue form.

## 2. Make a branch

Always start from a fresh `main`:

```bash
git switch main
git pull origin main
git switch -c feat/12-kanban-card
```

Branch name: `feat/<issue-number>-<short-name>`. Use `fix/` for a bug and `docs/` for documents.

Never work on `main`. GitHub does not let you push to it.

## 3. Do the work

**New node:**

```bash
pnpm new:node kanban-card
```

The script makes `src/nodes/kanban-card/` with three files. Change them. Look at your node at <http://localhost:5173/nodes>, then try it on the board. Your node shows in the **+** menu of the top bar.

**With an AI agent:** the agent reads `AGENTS.md` automatically. Give it the issue number, ask for a plan first, and read the plan before you say yes.

Keep the change small. A reviewer can read 100 lines well. A reviewer cannot read 1000.

## 4. Check

```bash
pnpm check
```

This runs the lint, the type check, the tests and the build. GitHub runs the same check on your pull request. If it fails on your computer, it fails on GitHub.

## 5. Commit

```bash
git status                      # which files did I change?
git diff                        # what did I change?
git add src/nodes/kanban-card
git commit -m "feat(kanban-card): add kanban card node"
```

Commit message: `<type>(<scope>): <what you did>`.

- Type: `feat` (new thing), `fix` (repair), `docs`, `test`, `refactor`.
- Scope: the node name, `board`, `canvas` or `docs`.

Make small commits. One commit for one step is better than one large commit at the end.

## 6. Push and open a pull request

```bash
git push -u origin feat/12-kanban-card
```

Git prints a link. Open it, or run `gh pr create`. Fill in the template:

- Write `Closes #12`. GitHub then closes the issue when the PR merges.
- Add a screenshot of your node. The gallery page is the easy place to make one.
- Ask one classmate for a review (**Reviewers**, on the right).

## 7. Review

You will give reviews and get reviews. Both are part of the lesson.

**When you review:**

- Open the **Files changed** tab. Click the **+** next to a line to write a comment on that line.
- Check out the branch and try it: `gh pr checkout 34`, then `pnpm dev`.
- Say what is good. Ask a question when you do not understand. Use a **suggestion** block when you have a concrete change.
- Finish with **Approve**, **Comment** or **Request changes**.

**When you get a review:**

- Answer each comment. Change the code, commit, and push to the same branch. The PR updates automatically.
- Click **Resolve conversation** when a comment is done.
- A comment is about the code, not about you.

## 8. Update your branch

Other people merge while you work. If GitHub shows "This branch is out-of-date" or a conflict:

```bash
git switch main
git pull origin main
git switch feat/12-kanban-card
git merge main
```

**A conflict?** Git marks the place in the file:

```
<<<<<<< HEAD
your version
=======
the version from main
>>>>>>> main
```

Keep the correct lines (often both), delete the three marker lines, then:

```bash
git add <the file>
git commit
pnpm check
git push
```

You will see few conflicts if you stay in your own node folder. That is why each node has its own folder.

## 9. Merge

When the check is green and one person approved, click **Squash and merge**. Then:

```bash
git switch main
git pull origin main
git branch -d feat/12-kanban-card
```

Your node is now in the app of each person who pulls `main`. Well done.

## Rules

- One issue, one branch, one PR.
- Do not change files outside your task. Do not reformat files of other people.
- Do not rename the `type` of a node that is merged. Nodes of that type are on the board.
- Do not delete the work of other people on the live board.
- Be kind in reviews.

## Help

| Problem                                         | Try                                                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| "I committed on `main`"                         | `git switch -c feat/my-branch`, and tell the teacher                                           |
| "I want to drop my local changes in one file"   | `git restore <file>`                                                                           |
| "My node does not show"                         | The folder needs an `index.ts` with `export default defineNode(...)`. Restart `pnpm dev`       |
| "The board shows _Unknown node_"                | A classmate merged a new node. Run `git pull origin main`                                      |
| "`pnpm check` fails in a file that is not mine" | Run `git pull origin main`. If it still fails, tell the teacher                                |
| "I do not see the board of the class"           | Your `.env.local` has no key, so the app is in mock mode. Add the key, then restart `pnpm dev` |
