import { StickerIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { CoolStickerNode, CoolStickerToolbar, type CoolStickerData } from "./cool-sticker"

export default defineNode<CoolStickerData>({
  type: "cool-sticker",
  label: "Cool stickers",
  description: "A fun sticker. Pick one in the top bar, then click or drag it to the board.",
  icon: StickerIcon,
  author: "@ccloudia",
  defaultSize: { width: 180, height: 180 },
  minSize: { width: 64, height: 64 },
  defaultData: { sticker: "delulu" },
  component: CoolStickerNode,
  toolbar: CoolStickerToolbar,
  connectable: false,
})
