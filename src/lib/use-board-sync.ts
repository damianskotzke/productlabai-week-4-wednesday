import { useEffect } from "react"
import { toast } from "sonner"
import { useBoardStore } from "@/canvas/store"
import { repository, seedBoard } from "./board-repository"

/**
 * Load the board one time, then listen for the changes of other people.
 * Use this hook one time, in the board component.
 */
export function useBoardSync() {
  useEffect(() => {
    const store = useBoardStore.getState()
    let active = true

    repository
      .load()
      .then((snapshot) => {
        if (!active) return
        store.hydrate(snapshot, repository.mode)
        if (repository.mode === "mock") {
          console.info(
            "Whiteboard: mock mode. No Supabase key in .env.local, so changes stay in this browser.",
          )
        }
        useBoardStore.getState().zoomToFit()
      })
      .catch((error: unknown) => {
        if (!active) return
        // Show the seed board, so the page is not empty. Nothing is saved.
        store.hydrate(structuredClone(seedBoard), "error")
        useBoardStore.getState().zoomToFit()
        toast.error("Could not load the board", {
          description: error instanceof Error ? error.message : undefined,
        })
      })

    const unsubscribe = repository.subscribe({
      onNode: store.applyRemoteNode,
      onNodeDeleted: store.applyRemoteNodeDeleted,
      onEdge: store.applyRemoteEdge,
      onEdgeDeleted: store.applyRemoteEdgeDeleted,
      onTitle: store.applyRemoteTitle,
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])
}
