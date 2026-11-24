import { Board } from "@/components/board/board"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { JoinPage } from "@/pages/join"
import { NodeGallery } from "@/pages/node-gallery"

/**
 * Three pages, chosen by the URL path: `/` is the board, `/nodes` is the gallery,
 * and `/join` is the sign-up form.
 * The links between them are normal links that load the page again,
 * so the app does not need a router library.
 */
function App() {
  const path = window.location.pathname.replace(/\/+$/, "")
  const page = path === "/nodes" ? <NodeGallery /> : path === "/join" ? <JoinPage /> : <Board />
  return (
    <TooltipProvider delay={300}>
      {page}
      <Toaster position="bottom-center" />
    </TooltipProvider>
  )
}

export default App
