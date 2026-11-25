import { RectangularIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { FlowCardNode, FlowCardToolbar, type FlowCardData } from "./card"

export default defineNode<FlowCardData>({
  type: "card",
  label: "Card",
  description: "A step in a flow. Connect cards with the dots.",
  icon: RectangularIcon,
  shortcut: "C",
  author: "@damianskotzke",
  defaultSize: { width: 240, height: 150 },
  minSize: { width: 140, height: 80 },
  defaultData: { text: "", color: "white", subtitle: "" },
  component: FlowCardNode,
  toolbar: FlowCardToolbar,
  editOnCreate: true,
})
