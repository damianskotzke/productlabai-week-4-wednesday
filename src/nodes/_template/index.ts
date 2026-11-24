import { GeometricShapes01Icon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { TemplateNode, type TemplateData } from "./template"

export default defineNode<TemplateData>({
  type: "template",
  label: "Template",
  description: "Say in one sentence what this node is for.",
  // Choose an icon: https://hugeicons.com/icons
  icon: GeometricShapes01Icon,
  author: "@your-github-handle",
  defaultSize: { width: 240, height: 120 },
  defaultData: { text: "" },
  component: TemplateNode,
})
