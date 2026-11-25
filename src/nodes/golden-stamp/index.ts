import { PawPrintIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { GoldenStampNode, type GoldenStampData } from "./golden-stamp"

export default defineNode<GoldenStampData>({
  type: "golden-stamp",
  label: "Golden stamp",
  description: "A golden retriever that shows how you feel.",
  icon: PawPrintIcon,
  author: "@Kasiazet",
  defaultSize: { width: 120, height: 140 },
  minSize: { width: 64, height: 80 },
  defaultData: { mood: "happy" },
  component: GoldenStampNode,
  connectable: false,
})
