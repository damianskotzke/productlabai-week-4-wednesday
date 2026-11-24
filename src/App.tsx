import { Board } from "@/components/board/board"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NodeGallery } from "@/pages/node-gallery"

/**
 * Two pages, chosen by the URL path: `/` is the board, `/nodes` is the gallery.
 * The links between them are normal links that load the page again,
 * so the app does not need a router library.
 */
function App() {
  const isGallery = window.location.pathname.replace(/\/+$/, "") === "/nodes"
  return (
    <TooltipProvider delay={300}>
      {isGallery ? <NodeGallery /> : <Board />}
      <Toaster position="bottom-center" />
    </TooltipProvider>
  )
}

export default App
