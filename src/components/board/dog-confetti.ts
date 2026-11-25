import dogUrl from "@/assets/reaction-dog.png"

const DURATION = 3000
const COUNT = 40

/**
 * Rain of dog stickers over the full screen for 3 seconds.
 * It uses plain DOM and the Web Animations API, so it does not change the board state.
 */
export function showDogConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const layer = document.createElement("div")
  layer.dataset.slot = "dog-confetti"
  layer.setAttribute("aria-hidden", "true")
  layer.className = "pointer-events-none fixed inset-0 z-50 overflow-hidden"

  const height = window.innerHeight
  for (let index = 0; index < COUNT; index++) {
    const dog = document.createElement("img")
    dog.src = dogUrl
    dog.alt = ""
    dog.className = "absolute top-0 h-auto drop-shadow-sm"
    const size = 28 + Math.random() * 36
    dog.style.width = `${size}px`
    dog.style.left = `${Math.random() * 100}%`
    layer.append(dog)

    const delay = Math.random() * 900
    const drift = (Math.random() - 0.5) * 160
    const spin = (Math.random() - 0.5) * 720
    dog.animate(
      [
        { transform: `translate(-50%, -120%) rotate(0deg)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${drift}px), ${height + size * 2}px) rotate(${spin}deg)`, opacity: 1 },
      ],
      { duration: DURATION - delay, delay, easing: "cubic-bezier(0.3, 0, 0.7, 1)", fill: "both" },
    )
  }

  document.body.append(layer)
  window.setTimeout(() => layer.remove(), DURATION)
}
