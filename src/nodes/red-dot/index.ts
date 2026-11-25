import { RecordIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { RedDotNode, type RedDotData } from "./red-dot"

export default defineNode<RedDotData>({
  type: "red-dot",
  label: "Red dot",
  description: "A simple red dot to mark a spot.",
  icon: RecordIcon,
  author: "@damianskotzke",
  defaultSize: { width: 48, height: 48 },
  minSize: { width: 16, height: 16 },
  defaultData: {},
  component: RedDotNode,
})
