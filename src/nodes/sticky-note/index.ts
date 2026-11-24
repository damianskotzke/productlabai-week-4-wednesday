import { StickyNote03Icon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { StickyNoteNode, StickyNoteToolbar, type StickyNoteData } from "./sticky-note"

export default defineNode<StickyNoteData>({
  type: "sticky-note",
  label: "Sticky",
  description: "A coloured note for one idea.",
  icon: StickyNote03Icon,
  shortcut: "S",
  author: "@damianskotzke",
  defaultSize: { width: 240, height: 240 },
  minSize: { width: 160, height: 120 },
  defaultData: { text: "", color: "yellow" },
  component: StickyNoteNode,
  toolbar: StickyNoteToolbar,
  editOnCreate: true,
})
