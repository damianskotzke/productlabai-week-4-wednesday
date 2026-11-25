import { GifIcon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { GifNode, GifToolbar, type GifData } from "./gif"

export default defineNode<GifData>({
  type: "gif",
  label: "GIF",
  description: "An animated GIF. Paste a link from Giphy or Tenor, or upload a file.",
  icon: GifIcon,
  author: "@kasia-slowik",
  defaultSize: { width: 320, height: 240 },
  minSize: { width: 120, height: 90 },
  defaultData: { src: "", alt: "" },
  component: GifNode,
  toolbar: GifToolbar,
})
