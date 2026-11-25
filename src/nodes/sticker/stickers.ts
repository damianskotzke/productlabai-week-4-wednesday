import bug from "./stickers/bug.svg"
import cat from "./stickers/cat.svg"
import coffee from "./stickers/coffee.svg"
import done from "./stickers/done.svg"
import fire from "./stickers/fire.svg"
import heart from "./stickers/heart.svg"
import idea from "./stickers/idea.svg"
import question from "./stickers/question.svg"
import rocket from "./stickers/rocket.svg"
import star from "./stickers/star.svg"
import thumbsUp from "./stickers/thumbs-up.svg"
import wow from "./stickers/wow.svg"

/**
 * All stickers, in the order of the picker.
 * To add one: put an SVG in `stickers/` and add a line here.
 * Do not change an `id` after the merge. Saved stickers use it.
 */
export const STICKERS = [
  { id: "star", label: "Star", src: star },
  { id: "heart", label: "Heart", src: heart },
  { id: "thumbs-up", label: "Thumbs up", src: thumbsUp },
  { id: "wow", label: "Wow", src: wow },
  { id: "fire", label: "Fire", src: fire },
  { id: "rocket", label: "Rocket", src: rocket },
  { id: "idea", label: "Idea", src: idea },
  { id: "done", label: "Done", src: done },
  { id: "question", label: "Question", src: question },
  { id: "bug", label: "Bug", src: bug },
  { id: "coffee", label: "Coffee", src: coffee },
  { id: "cat", label: "Cat", src: cat },
] as const

export type StickerId = (typeof STICKERS)[number]["id"]

/** Old or unknown data gets the first sticker, so the node always shows a picture. */
export function findSticker(id: string | undefined) {
  return STICKERS.find((sticker) => sticker.id === id) ?? STICKERS[0]
}
