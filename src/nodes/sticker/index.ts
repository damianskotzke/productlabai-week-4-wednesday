import { StickerIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { StickerNode, StickerToolbar, type StickerData } from "./sticker"

export default defineNode<StickerData>({
  type: "sticker",
  label: "Sticker",
  description: "A fun picture. Choose one of the stickers in the context bar.",
  icon: StickerIcon,
  author: "@magdakazulak",
  defaultSize: { width: 160, height: 160 },
  minSize: { width: 64, height: 64 },
  defaultData: { sticker: "star" },
  component: StickerNode,
  toolbar: StickerToolbar,
  connectable: false,
  editOnCreate: true,
})
