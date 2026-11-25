import { Image01Icon } from "@hugeicons/core-free-icons"
import { defineNode } from "../define-node"
import { ImageNode, ImageToolbar, type ImageData } from "./image"

export default defineNode<ImageData>({
  type: "image",
  label: "Image",
  description: "A picture. The file goes to Supabase Storage.",
  icon: Image01Icon,
  shortcut: "I",
  author: "@damianskotzke",
  defaultSize: { width: 320, height: 220 },
  minSize: { width: 120, height: 90 },
  defaultData: { src: "", alt: "", fit: "cover" },
  component: ImageNode,
  toolbar: ImageToolbar,
  editable: false,
})
