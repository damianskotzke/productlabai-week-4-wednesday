import { Timer02Icon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { TomatoTimerNode, TomatoTimerToolbar, type TomatoTimerData } from "./tomato-timer"

export default defineNode<TomatoTimerData>({
  type: "tomato-timer",
  label: "Tomato timer",
  description: "A Pomodoro timer for focus blocks. All people see the same time.",
  icon: Timer02Icon,
  author: "@falka2",
  defaultSize: { width: 200, height: 200 },
  minSize: { width: 140, height: 140 },
  defaultData: { text: "Focus", minutes: 25, endsAt: null, remainingMs: null },
  component: TomatoTimerNode,
  toolbar: TomatoTimerToolbar,
})
