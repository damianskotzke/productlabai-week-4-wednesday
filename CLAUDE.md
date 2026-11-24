# CLAUDE.md

The rules for this repository are in `AGENTS.md`. Read them first.

@AGENTS.md

## Extra rules for Claude Code

- **Ask before each `git commit` and each `git push`.** Show the changed files and wait for a "yes". This applies after each task, also when the user approved a commit earlier.
- Start each task with the issue. If the user gives an issue number, read it with `gh issue view <number>`. If there is no issue, ask the user which of the three task types this is (new node, improve a node, main UI).
- Check the branch before you edit: `git branch --show-current`. If it is `main`, make a branch first: `git switch -c feat/<issue-number>-<short-name>`.
- For a new node, run `pnpm new:node <name>` first. Then edit the files that the script made.
- To check your work, start `pnpm dev` and open `http://localhost:5173/nodes`. Look at the node in a browser if you have a browser tool. A passing test does not prove that the node looks correct.
- Put temporary files (screenshots, notes) in `.verification/`. Git ignores this folder.
- When you open a PR, use the template in `.github/pull_request_template.md` and add `Closes #<issue-number>`.
- If `pnpm check` fails in a file that you did not change, do not repair it in this PR. Tell the user.
