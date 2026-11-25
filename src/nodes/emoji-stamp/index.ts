import { SmileIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { EmojiStampNode, EmojiStampToolbar, type EmojiStampData } from "./emoji-stamp"

export default defineNode<EmojiStampData>({
  type: "emoji-stamp",
  label: "Emoji stamp",
  description: "A large emoji to mark a place on the board.",
  icon: SmileIcon,
  author: "@marhenyk",
  defaultSize: { width: 120, height: 120 },
  minSize: { width: 40, height: 40 },
  defaultData: { emoji: "👍" },
  component: EmojiStampNode,
  toolbar: EmojiStampToolbar,
  connectable: false,
})
