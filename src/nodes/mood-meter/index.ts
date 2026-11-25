import { SmileIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { MoodMeterNode, type MoodMeterData } from "./mood-meter"

export default defineNode<MoodMeterData>({
  type: "mood-meter",
  label: "Mood meter",
  description: "A fast check-in: a question and five faces from sad to happy.",
  icon: SmileIcon,
  author: "@Natqa",
  defaultSize: { width: 280, height: 130 },
  minSize: { width: 240, height: 110 },
  defaultData: { question: "", mood: null },
  component: MoodMeterNode,
})
