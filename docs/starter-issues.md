# Starter issues

More than 60 ideas for a first contribution. Each one is small on purpose.

- 🟢 easy: one file or one folder, a good first pull request.
- 🟡 medium: some logic, or two or three files.
- 🔴 hard: touches the engine or the data. Write a short plan in the issue first.

One person for each issue. Have your own idea? Open a new issue with the issue form.

For the teacher: `node scripts/create-issues.mjs` shows what it will create. Add `--yes` to create the issues on GitHub.

<!-- The script reads this file. Keep the format: a `###` title, then a `Labels:` line, then the text. -->

## A. New node types

Each of these is a new folder in `src/nodes/`. Start with `pnpm new:node <name>` and read "Task 1" in `AGENTS.md`.

### New node: checklist

Labels: new-node, easy

🟢 easy

A list of tasks with check boxes. A click on a box toggles it.

**Data:** `title`, `items: { text, done }[]`

**Done when**

- [ ] `src/nodes/checklist/` exists (made with `pnpm new:node checklist`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: kanban-card

Labels: new-node, easy

🟢 easy

One task with a title and a status badge: To do, Doing, Done.

**Data:** `title`, `status`

**Done when**

- [ ] `src/nodes/kanban-card/` exists (made with `pnpm new:node kanban-card`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: poll

Labels: new-node, medium

🟡 medium

A question with two to four answers. Each click adds one vote. Show the votes as bars.

**Data:** `question`, `options: { text, votes }[]`

**Done when**

- [ ] `src/nodes/poll/` exists (made with `pnpm new:node poll`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: link-card

Labels: new-node, easy

🟢 easy

A card with a title and a URL. A click on the link opens it in a new tab.

**Data:** `title`, `url`

**Done when**

- [ ] `src/nodes/link-card/` exists (made with `pnpm new:node link-card`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: code-block

Labels: new-node, easy

🟢 easy

Code in a monospace font on a dark background.

**Data:** `code`, `language`

**Done when**

- [ ] `src/nodes/code-block/` exists (made with `pnpm new:node code-block`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: quote

Labels: new-node, easy

🟢 easy

A quote with a large quotation mark and the name of the author below.

**Data:** `text`, `author`

**Done when**

- [ ] `src/nodes/quote/` exists (made with `pnpm new:node quote`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: persona

Labels: new-node, medium

🟡 medium

A user persona: name, role, goal and pain point.

**Data:** `name`, `role`, `goal`, `pain`

**Done when**

- [ ] `src/nodes/persona/` exists (made with `pnpm new:node persona`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: emoji-stamp

Labels: new-node, easy

🟢 easy

One large emoji, with a small menu to choose it.

**Data:** `emoji`

**Done when**

- [ ] `src/nodes/emoji-stamp/` exists (made with `pnpm new:node emoji-stamp`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: countdown

Labels: new-node, medium

🟡 medium

Shows the time that is left until a date and time.

**Data:** `title`, `until` (ISO date)

**Done when**

- [ ] `src/nodes/countdown/` exists (made with `pnpm new:node countdown`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: progress-bar

Labels: new-node, easy

🟢 easy

A label and a bar from 0 to 100 %. Buttons change the value in steps of 10.

**Data:** `label`, `value`

**Done when**

- [ ] `src/nodes/progress-bar/` exists (made with `pnpm new:node progress-bar`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: rating

Labels: new-node, easy

🟢 easy

Five stars. A click on a star sets the rating.

**Data:** `label`, `stars`

**Done when**

- [ ] `src/nodes/rating/` exists (made with `pnpm new:node rating`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: heading

Labels: new-node, easy

🟢 easy

A large section title to give structure to the board.

**Data:** `text`, `level`

**Done when**

- [ ] `src/nodes/heading/` exists (made with `pnpm new:node heading`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: frame

Labels: new-node, medium

🟡 medium

A large box with a title, to put a group of nodes in. It must stay behind the other nodes in look (thin border, no fill).

**Data:** `title`

**Done when**

- [ ] `src/nodes/frame/` exists (made with `pnpm new:node frame`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: person-card

Labels: new-node, easy

🟢 easy

An avatar circle with initials, a name and a role.

**Data:** `name`, `role`

**Done when**

- [ ] `src/nodes/person-card/` exists (made with `pnpm new:node person-card`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: comment-bubble

Labels: new-node, easy

🟢 easy

A speech bubble with a small tail and the name of the person.

**Data:** `text`, `author`

**Done when**

- [ ] `src/nodes/comment-bubble/` exists (made with `pnpm new:node comment-bubble`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: shape

Labels: new-node, medium

🟡 medium

A rectangle, ellipse or diamond with text in the centre. The toolbar changes the shape.

**Data:** `shape`, `text`, `color`

**Done when**

- [ ] `src/nodes/shape/` exists (made with `pnpm new:node shape`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: counter

Labels: new-node, easy

🟢 easy

A number with a minus button and a plus button.

**Data:** `label`, `count`

**Done when**

- [ ] `src/nodes/counter/` exists (made with `pnpm new:node counter`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: deadline

Labels: new-node, easy

🟢 easy

A date with a label. The colour changes when the date is in the past.

**Data:** `label`, `date`

**Done when**

- [ ] `src/nodes/deadline/` exists (made with `pnpm new:node deadline`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: metric

Labels: new-node, easy

🟢 easy

A KPI card: label, a large number, and a trend arrow up or down.

**Data:** `label`, `value`, `trend`

**Done when**

- [ ] `src/nodes/metric/` exists (made with `pnpm new:node metric`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: pros-cons

Labels: new-node, medium

🟡 medium

Two columns: pros and cons. Each column is editable text.

**Data:** `pros`, `cons`

**Done when**

- [ ] `src/nodes/pros-cons/` exists (made with `pnpm new:node pros-cons`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: user-story

Labels: new-node, easy

🟢 easy

A card with three fields: As a…, I want…, so that….

**Data:** `role`, `want`, `reason`

**Done when**

- [ ] `src/nodes/user-story/` exists (made with `pnpm new:node user-story`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: traffic-light

Labels: new-node, easy

🟢 easy

Three circles: red, yellow, green. A click sets the active one.

**Data:** `label`, `state`

**Done when**

- [ ] `src/nodes/traffic-light/` exists (made with `pnpm new:node traffic-light`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: mood-meter

Labels: new-node, easy

🟢 easy

Five faces from sad to happy. A click selects one.

**Data:** `question`, `mood`

**Done when**

- [ ] `src/nodes/mood-meter/` exists (made with `pnpm new:node mood-meter`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: callout

Labels: new-node, easy

🟢 easy

An information box with an icon. Variants: info, warning, success.

**Data:** `text`, `variant`

**Done when**

- [ ] `src/nodes/callout/` exists (made with `pnpm new:node callout`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: step-badge

Labels: new-node, easy

🟢 easy

A circle with a number and a short label next to it, for the steps of a process.

**Data:** `number`, `label`

**Done when**

- [ ] `src/nodes/step-badge/` exists (made with `pnpm new:node step-badge`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: color-swatch

Labels: new-node, easy

🟢 easy

A colour square with its name and its token name. Use theme tokens.

**Data:** `name`, `token`

**Done when**

- [ ] `src/nodes/color-swatch/` exists (made with `pnpm new:node color-swatch`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: video-embed

Labels: new-node, medium

🟡 medium

A YouTube video in the node, from a pasted URL. Show a placeholder when the URL is empty or wrong.

**Data:** `url`

**Done when**

- [ ] `src/nodes/video-embed/` exists (made with `pnpm new:node video-embed`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: table

Labels: new-node, hard

🔴 hard

A small table with editable cells. The toolbar adds a row or a column.

**Data:** `rows: string[][]`

**Done when**

- [ ] `src/nodes/table/` exists (made with `pnpm new:node table`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: avatar-upload

Labels: new-node, medium

🟡 medium

A round profile picture that the person uploads, with a name below. Use `uploadFile()`.

**Data:** `src`, `name`

**Done when**

- [ ] `src/nodes/avatar-upload/` exists (made with `pnpm new:node avatar-upload`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

### New node: decision

Labels: new-node, medium

🟡 medium

A question with a Yes branch label and a No branch label, for flow diagrams.

**Data:** `question`

**Done when**

- [ ] `src/nodes/decision/` exists (made with `pnpm new:node decision`)
- [ ] The node works in the gallery (`/nodes`) and on the board: create, edit, resize, reload
- [ ] The node uses theme tokens, not hex colours
- [ ] `pnpm check` passes

## B. Improve a node

Each of these changes one folder in `src/nodes/`. Read "Task 2" in `AGENTS.md`: nodes on the live board must still work after your change.

### Improve sticky-note: add two colours: green and orange

Labels: improve-node, easy

🟢 easy

Add the tokens to `src/index.css`, the variants to `stickyNoteVariants`, and the options to the colour picker.

**Where:** `src/nodes/sticky-note/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve sticky-note: add a bold toggle

Labels: improve-node, easy

🟢 easy

A toolbar button that makes the text bold. Save it as an optional `bold` field.

**Where:** `src/nodes/sticky-note/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve sticky-note: show the author on the note

Labels: improve-node, easy

🟢 easy

Not possible with the props of today: the node does not get `createdBy`. Propose a solution in the issue before you write code (this touches `define-node.ts`).

**Where:** `src/nodes/sticky-note/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve sticky-note: better font size rule

Labels: improve-node, medium

🟡 medium

The text size depends on the number of characters. Make the rule use the node width and height too, so long text fits in a small note.

**Where:** `src/nodes/sticky-note/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve card: add a subtitle

Labels: improve-node, easy

🟢 easy

A second, smaller line of text below the title. Optional field `subtitle`.

**Where:** `src/nodes/card/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve card: add a status badge

Labels: improve-node, easy

🟢 easy

A small badge in the corner: Draft, Ready, Live. The toolbar changes it.

**Where:** `src/nodes/card/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve card: add more colours

Labels: improve-node, easy

🟢 easy

Add yellow and purple faces. Reuse or add theme tokens.

**Where:** `src/nodes/card/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve card: add an optional icon

Labels: improve-node, medium

🟡 medium

A Hugeicons icon above the title, chosen from a short list in the toolbar.

**Where:** `src/nodes/card/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve text: add text sizes

Labels: improve-node, easy

🟢 easy

Toolbar control with S, M and L. Save it as an optional `size` field with M as the default.

**Where:** `src/nodes/text/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve text: add text alignment

Labels: improve-node, easy

🟢 easy

Toolbar control: left, centre, right.

**Where:** `src/nodes/text/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve text: add a text colour

Labels: improve-node, easy

🟢 easy

Toolbar colour picker with three or four theme colours.

**Where:** `src/nodes/text/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: add a caption

Labels: improve-node, easy

🟢 easy

Editable text below the picture. Optional field `caption`.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: edit the alt text

Labels: improve-node, easy

🟢 easy

A toolbar popover with an input for `alt`. Explain in the placeholder why alt text helps.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: add a round shape

Labels: improve-node, easy

🟢 easy

Toolbar toggle between a rectangle and a circle.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: show a loading state

Labels: improve-node, easy

🟢 easy

Show a skeleton or a spinner until the picture has loaded.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: paste an image from the clipboard

Labels: improve-node, medium

🟡 medium

When an empty image node is selected and the person pastes an image, upload it.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve image: show a clear error for a wrong file

Labels: improve-node, easy

🟢 easy

When the file is too large or not an image, show which limit applies.

**Where:** `src/nodes/image/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

### Improve _template: make the template better for beginners

Labels: improve-node, easy

🟢 easy

Add comments or a second example part, so a new person understands faster. Do not make it longer than 80 lines.

**Where:** `src/nodes/_template/`

**Done when**

- [ ] The change is only in that folder (plus `src/index.css` if you add a token)
- [ ] New data fields are optional, so old nodes still work
- [ ] A test covers the change
- [ ] `pnpm check` passes

## C. Main UI and canvas

These change shared files. Pull `main` often, and keep the PR small. Read "Task 3" in `AGENTS.md`.

### UI: zoom controls

Labels: main-ui, easy

🟢 easy

Buttons for zoom out, zoom in and the zoom percent in a small bar at the bottom right. A click on the percent goes to 100 %.

**Where:** `src/components/board/` (new file `zoom-controls.tsx`), `board.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: keyboard shortcut help

Labels: main-ui, easy

🟢 easy

A `?` button that opens a dialog with all shortcuts. Read the node shortcuts from the registry.

**Where:** new file in `src/components/board/`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: duplicate a node

Labels: main-ui, easy

🟢 easy

A "Duplicate" item in the More menu of the context bar, and the shortcut ⌘D. The copy goes 24 px down and right.

**Where:** `context-bar.tsx`, `store.ts`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: send to back

Labels: main-ui, easy

🟢 easy

A "Send to back" item next to "Bring to front".

**Where:** `context-bar.tsx`, `store.ts`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: remove one tag or reaction

Labels: main-ui, medium

🟡 medium

A click on a tag or a reaction of a selected node removes it. Now it is only possible to clear all.

**Where:** `node-decorations.tsx`, `node-shell.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: connection status badge

Labels: main-ui, easy

🟢 easy

Show a small badge on the board that tells the person if the board is live or in mock mode. Read `status` from the board store.

**Where:** new file in `src/components/board/`, `board.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: empty board message

Labels: main-ui, easy

🟢 easy

When the board has no nodes, show a friendly message in the centre with the first step.

**Where:** `board.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: move a node with the arrow keys

Labels: main-ui, easy

🟢 easy

Arrow keys move the selected node by 8 units. With Shift: 1 unit.

**Where:** `use-board-gestures.ts`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: snap to grid

Labels: main-ui, medium

🟡 medium

A toggle in the board menu. When it is on, a dragged node snaps to the 24 unit grid.

**Where:** `use-board-gestures.ts`, `store.ts`, `top-bar.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: search the node menu

Labels: main-ui, easy

🟢 easy

Add a search input at the top of the "More nodes" menu. It filters by label and author.

**Where:** `top-bar.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: search the node gallery

Labels: main-ui, easy

🟢 easy

Add a search input to the gallery page. It filters by label, type and author.

**Where:** `src/pages/node-gallery.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: gallery: show the selected state

Labels: main-ui, easy

🟢 easy

A toggle on each gallery card that shows the node in its selected look.

**Where:** `src/pages/node-gallery.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: connector arrowheads

Labels: main-ui, medium

🟡 medium

Draw an arrowhead at the target end of each connector, on the canvas.

**Where:** `canvas-layer.tsx`, `geometry.ts` (with a test)

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: connector colour

Labels: main-ui, medium

🟡 medium

A colour control in the connector context bar. Save it in the `data` of the edge.

**Where:** `context-bar.tsx`, `canvas-layer.tsx`, `board-repository.ts`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: grid style toggle

Labels: main-ui, easy

🟢 easy

A board menu item that changes the grid: dots, lines, or none. Keep the choice in localStorage.

**Where:** `canvas-layer.tsx`, `top-bar.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: dark theme

Labels: main-ui, medium

🟡 medium

A theme toggle in the profile menu. Add dark values for the whiteboard tokens in `src/index.css`. The canvas reads the tokens again after the change.

**Where:** `src/index.css`, `top-bar.tsx`, `canvas-layer.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: mention chips

Labels: main-ui, hard

🔴 hard

The design shows a person chip in the text (`@Takumi`). Render `@[Name]` in a sticky note as a chip with an avatar.

**Where:** `editable-text.tsx` or the sticky note

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: pen tool

Labels: main-ui, hard

🔴 hard

A tool that draws a freehand stroke on the canvas. Save each stroke as a node of type `stroke` with its points.

**Where:** `src/canvas/`, new node folder

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: undo and redo

Labels: main-ui, hard

🔴 hard

⌘Z and ⌘⇧Z for the changes of the local person. Write a short plan in the issue first.

**Where:** `store.ts`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: live cursors

Labels: main-ui, hard

🔴 hard

Show the cursors and names of the other people with Supabase Realtime Presence.

**Where:** `src/lib/`, new file in `src/components/board/`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: who is online

Labels: main-ui, medium

🟡 medium

Show the number of people on the board, with Supabase Realtime Presence.

**Where:** `src/lib/`, `top-bar.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: select many nodes

Labels: main-ui, hard

🔴 hard

Drag a rectangle on the background to select many nodes, then move or delete them together.

**Where:** `use-board-gestures.ts`, `store.ts`, `canvas-layer.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: export the board as an image

Labels: main-ui, hard

🔴 hard

A board menu item that downloads a PNG of the board.

**Where:** new file in `src/lib/` or `src/canvas/`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

### UI: inline rename of the board

Labels: main-ui, easy

🟢 easy

A double click on the board title edits it in place, without the dialog.

**Where:** `top-bar.tsx`

**Done when**

- [ ] It works with the mouse and with the keyboard
- [ ] It works in mock mode and in live mode
- [ ] `pnpm check` passes

## D. Tests and documents

### Test: the store removes connectors with their node

Labels: quality, easy

🟢 easy

Add `src/canvas/store.test.ts`. Add two nodes and a connector, remove one node, and expect that the connector is gone.

**Done when**

- [ ] `pnpm check` passes

### Test: the colour picker

Labels: quality, easy

🟢 easy

Add a test for `ColorPicker`: it shows each option, and a click calls `onChange`.

**Done when**

- [ ] `pnpm check` passes

### Accessibility check of the top bar

Labels: quality, medium

🟡 medium

Use the board with the keyboard only and with a screen reader. Repair one problem that you find, and list the others in new issues.

**Done when**

- [ ] `pnpm check` passes

### Add a screenshot to the README

Labels: quality, easy

🟢 easy

Add one picture of the board and one of the gallery to `docs/` and show them in the README.

**Done when**

- [ ] `pnpm check` passes
