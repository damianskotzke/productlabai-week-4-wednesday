import { useState } from "react"
import { toast } from "sonner"
import {
  ArrowDown01Icon,
  Cursor02Icon,
  DashboardSquare01Icon,
  FullScreenIcon,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import avatar from "@/assets/avatar-me.png"
import { githubAvatarUrl, setGithubUser, useGithubUser } from "@/lib/identity"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { nodeDefinitions } from "@/nodes/registry"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Bar, BarButton, BarGroup, BarSeparator } from "./bar"
import { TextPromptDialog } from "./text-prompt-dialog"

/**
 * The node types that have their own button, in this order.
 * All other node types are in the "More nodes" menu, so the bar stays small
 * when the class adds many node types.
 */
const PINNED_TOOLS = ["text", "sticky-note", "card", "image"]

const pinnedDefinitions = PINNED_TOOLS.flatMap((type) =>
  nodeDefinitions.filter((definition) => definition.type === type),
)
const moreDefinitions = nodeDefinitions.filter((definition) => !PINNED_TOOLS.includes(definition.type))

/**
 * The bar at the top left: board title, tools, and the avatar.
 * The tools come from the node registry. A new node shows in the "More nodes" menu.
 */
function TopBar() {
  const title = useBoardStore((state) => state.title)
  const tool = useBoardStore((state) => state.tool)
  const setTool = useBoardStore((state) => state.setTool)
  const setTitle = useBoardStore((state) => state.setTitle)
  const zoomToFit = useBoardStore((state) => state.zoomToFit)
  const githubUser = useGithubUser()
  const [dialog, setDialog] = useState<"rename" | "name" | null>(null)

  return (
    <>
      <Bar data-slot="top-bar" role="toolbar" aria-label="Board tools" className="top-3 left-3">
        <BarGroup className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 max-w-64 items-center gap-1 rounded-sm py-1.5 pr-1.5 pl-2 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
              <span className="truncate">{title || "Loading…"}</span>
              <Icon icon={ArrowDown01Icon} className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent data-board-ui className="w-52" sideOffset={12}>
              <DropdownMenuItem onClick={() => setDialog("rename")}>
                <Icon icon={PencilEdit02Icon} /> Rename board
              </DropdownMenuItem>
              <DropdownMenuItem onClick={zoomToFit}>
                <Icon icon={FullScreenIcon} /> Zoom to fit
                <DropdownMenuShortcut>⌘0</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<a href="/nodes" />}>
                <Icon icon={DashboardSquare01Icon} /> Node gallery
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BarGroup>

        <BarSeparator />

        <BarGroup className="p-2">
          <BarButton
            label="Select"
            shortcut="V"
            active={tool === SELECT_TOOL}
            onClick={() => setTool(SELECT_TOOL)}
          >
            <Icon icon={Cursor02Icon} />
          </BarButton>
          {pinnedDefinitions.map((definition) => (
            <BarButton
              key={definition.type}
              label={definition.label}
              shortcut={definition.shortcut}
              active={tool === definition.type}
              onClick={() => setTool(tool === definition.type ? SELECT_TOOL : definition.type)}
            >
              <Icon icon={definition.icon} />
            </BarButton>
          ))}
          {moreDefinitions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More nodes"
                    title="More nodes"
                    data-active={moreDefinitions.some((definition) => definition.type === tool) || undefined}
                    className="rounded-sm text-foreground data-active:border-border data-active:bg-muted data-active:shadow-flat [&_svg:not([class*='size-'])]:size-5"
                  />
                }
              >
                <Icon icon={PlusSignIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent data-board-ui className="max-h-96 w-64" sideOffset={12}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>More nodes ({moreDefinitions.length})</DropdownMenuLabel>
                  {moreDefinitions.map((definition) => (
                    <DropdownMenuItem key={definition.type} onClick={() => setTool(definition.type)}>
                      <Icon icon={definition.icon} />
                      <span className="truncate">{definition.label}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {definition.author}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </BarGroup>

        <BarSeparator />

        <BarGroup className="p-2">
          <BarButton
            label={githubUser ? `You are @${githubUser}. Click to change.` : "Set your GitHub name"}
            onClick={() => setDialog("name")}
          >
            <img
              src={githubUser ? githubAvatarUrl(githubUser) : avatar}
              alt=""
              className="size-6 rounded-full"
              onError={(event) => {
                event.currentTarget.src = avatar
              }}
            />
          </BarButton>
        </BarGroup>
      </Bar>

      <TextPromptDialog
        open={dialog === "rename"}
        onOpenChange={(open) => setDialog(open ? "rename" : null)}
        title="Rename board"
        description="All people on the board see the new name."
        initialValue={title}
        onSubmit={setTitle}
      />

      <TextPromptDialog
        open={dialog === "name"}
        onOpenChange={(open) => setDialog(open ? "name" : null)}
        title="Your GitHub name"
        description="Your GitHub picture shows on the nodes that you add, so people see whose idea it is."
        placeholder="octocat"
        initialValue={githubUser ?? ""}
        submitLabel="Save"
        onSubmit={(value) => {
          const saved = setGithubUser(value)
          if (saved) toast.success(`Hi @${saved}! New nodes show your picture.`)
          else toast.error("That is not a GitHub username.")
        }}
      />
    </>
  )
}

export { TopBar }
