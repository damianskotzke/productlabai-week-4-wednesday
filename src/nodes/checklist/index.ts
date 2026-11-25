import { CheckListIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { ChecklistNode, ChecklistToolbar, type ChecklistData } from "./checklist"

export default defineNode<ChecklistData>({
  type: "checklist",
  label: "Checklist",
  description: "A note with a list of tasks that you can tick.",
  icon: CheckListIcon,
  author: "@kasiakwiat",
  defaultSize: { width: 240, height: 240 },
  minSize: { width: 160, height: 120 },
  defaultData: { title: "", color: "yellow", items: [{ id: "first", text: "", done: false }] },
  component: ChecklistNode,
  toolbar: ChecklistToolbar,
  editOnCreate: true,
})
