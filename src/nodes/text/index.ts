import { TextIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { TextNode, TextToolbar, type TextData } from "./text"

export default defineNode<TextData>({
  type: "text",
  label: "Text",
  description: "Plain text with no background.",
  icon: TextIcon,
  shortcut: "T",
  author: "@damianskotzke",
  defaultSize: { width: 240, height: 34 },
  minSize: { width: 60, height: 34 },
  defaultData: { text: "" },
  component: TextNode,
  toolbar: TextToolbar,
  connectable: false,
  editOnCreate: true,
})
