/**
 * A small library of hand-picked GIFs from Giphy.
 * The node shows these in a search panel, so a person does not have to find a link.
 * To add a GIF: open it on giphy.com, copy the id at the end of the page link, and add a line.
 */
export type LibraryGif = {
  /** The Giphy id. The last part of a link like giphy.com/gifs/name-ID */
  id: string
  /** A short name. It is also the alt text. */
  label: string
  /** Words that a person can search for. */
  tags: string[]
}

export const GIF_LIBRARY: LibraryGif[] = [
  { id: "BYoRqTmcgzHcL9TCy1", label: "Thumbs up", tags: ["yes", "ok", "good", "thanks", "like"] },
  { id: "CvZuv5m5cKl8c", label: "Two thumbs up", tags: ["yes", "ok", "good", "good luck", "like"] },
  { id: "m745dTCAxerHa", label: "Yes!", tags: ["yes", "win", "success", "happy"] },
  { id: "89x4osEodHEoo", label: "Yes", tags: ["yes", "win", "agree"] },
  { id: "gnE4FFhtFoLKM", label: "No", tags: ["no", "nope", "disagree"] },
  { id: "xdLH51eNWZAHrwy5mf", label: "No, thanks", tags: ["no", "nope", "disagree"] },
  { id: "udmx3pgdiD7tm", label: "Wow", tags: ["wow", "amazing", "surprised"] },
  { id: "Sqfu14lSonVN219Zb6", label: "So excited", tags: ["wow", "excited", "happy", "amazing"] },
  { id: "75ZaxapnyMp2w", label: "Mind blown", tags: ["wow", "mind blown", "amazing", "surprised"] },
  { id: "IcGkqdUmYLFGE", label: "Thank you", tags: ["thanks", "thank you"] },
  { id: "l3q2wJsC23ikJg9xe", label: "Thanks a lot", tags: ["thanks", "thank you", "grateful"] },
  { id: "Rgn6cUfaN5zW", label: "Applause", tags: ["clap", "applause", "bravo", "well done"] },
  { id: "QTAVEex4ANH1pcdg16", label: "Big clap", tags: ["clap", "applause", "bravo", "well done"] },
  { id: "WKdPOVCG5LPaM", label: "High five", tags: ["high five", "team", "well done"] },
  { id: "XBlwFU4OJ0cgZVbNUl", label: "Good job", tags: ["good job", "well done", "celebrate", "team"] },
  { id: "blSTtZehjAZ8I", label: "Party time", tags: ["party", "dance", "celebrate", "fun"] },
  { id: "LUhUvH4BsfE9USnlPd", label: "Happy dance", tags: ["party", "dance", "happy", "celebrate"] },
  { id: "BPJmthQ3YRwD6QqcVD", label: "Cheers", tags: ["cheers", "celebrate", "party", "toast"] },
  { id: "ujTVMASREzuRbH6zy5", label: "Dance moves", tags: ["dance", "party", "fun"] },
  { id: "d3mlE7uhX8KFgEmY", label: "Think about it", tags: ["thinking", "idea", "smart"] },
  { id: "777Aby0ZetYE8", label: "Think, think", tags: ["thinking", "hmm", "idea"] },
  { id: "ji6zzUZwNIuLS", label: "Confused", tags: ["confused", "what", "huh"] },
  { id: "hzrvwvnbgIV6E", label: "What?", tags: ["confused", "what", "huh"] },
  { id: "XD4qHZpkyUFfq", label: "Facepalm", tags: ["facepalm", "oops", "mistake"] },
  { id: "3og0INyCmHlNylks9O", label: "Classic facepalm", tags: ["facepalm", "oops", "mistake"] },
  { id: "zJ8ldRaGLnHTa", label: "Too much coffee", tags: ["coffee", "energy", "busy"] },
  { id: "o6B9v3SVmkzOmvwhTy", label: "Good morning", tags: ["coffee", "morning", "tired", "hello"] },
  { id: "xT9IgG50Fb7Mi0prBC", label: "Hello!", tags: ["hello", "hi", "wave"] },
  { id: "CK0Eg2ymtfzTO2yVJD", label: "Hi there", tags: ["hello", "hi", "wave"] },
  { id: "XHeLeuirRbwptHhSWd", label: "Laugh", tags: ["laugh", "lol", "funny"] },
  { id: "ZqlvCTNHpqrio", label: "Giggle", tags: ["laugh", "lol", "funny"] },
  { id: "P53TSsopKicrm", label: "Sad", tags: ["sad", "rain", "sorry"] },
  { id: "lHi4RqYaKlisaZBRmB", label: "Hearts", tags: ["love", "heart", "like"] },
  { id: "iVJEhiEdcMNQ4", label: "Whatever", tags: ["whatever", "deal with it", "eye roll"] },
  { id: "QBd2kLB5qDmysEXre9", label: "Waiting", tags: ["waiting", "bored", "slow"] },
  { id: "QZyBvNVaMbIZ9yadec", label: "Still waiting", tags: ["waiting", "slow", "bored"] },
  { id: "b0KqQy2HXjBjFC30Rb", label: "Dancing dog", tags: ["dog", "dance", "animal", "happy"] },
  { id: "62bRBJV1ccA9nyLmKy", label: "Cat", tags: ["cat", "animal", "meme"] },
]

/** The full GIF for the node. */
export function libraryGifUrl(id: string): string {
  return `https://media.giphy.com/media/${id}/giphy.gif`
}

/** A small, light version for the search panel. */
export function libraryGifThumbUrl(id: string): string {
  return `https://media.giphy.com/media/${id}/200w.gif`
}

/** Find the GIFs whose label or tags contain the search text. An empty search gives all GIFs. */
export function searchGifLibrary(query: string, library: LibraryGif[] = GIF_LIBRARY): LibraryGif[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return library
  return library.filter((gif) => {
    const text = [gif.label, ...gif.tags].join(" ").toLowerCase()
    return words.every((word) => text.includes(word))
  })
}

/**
 * Make a GIF link from the text that a person pastes.
 * Gives `null` when the text is not an http(s) link.
 * A Giphy page link (giphy.com/gifs/name-ID) becomes the direct link to its GIF file.
 */
export function toGifUrl(input: string): string | null {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null

  const giphyPage =
    url.hostname.replace(/^www\./, "") === "giphy.com" &&
    url.pathname.match(/^\/gifs\/(?:.*-)?([A-Za-z0-9]+)\/?$/)
  if (giphyPage) return `https://media.giphy.com/media/${giphyPage[1]}/giphy.gif`

  return url.toString()
}
