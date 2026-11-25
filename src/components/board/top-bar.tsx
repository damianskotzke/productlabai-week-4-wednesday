import { useLayoutEffect, useState } from "react"
import { toast } from "sonner"
import {
  ArrowDown01Icon,
  Cursor02Icon,
  DashboardSquare01Icon,
  FullScreenIcon,
  GridIcon,
  Moon02Icon,
  PencilEdit02Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import { GRID_STYLES, useGridStyle, type GridStyle } from "@/canvas/grid-style"
import { SELECT_TOOL, useBoardStore } from "@/canvas/store"
import avatar from "@/assets/avatar-me.png"
import { githubAvatarUrl, setGithubUser, useGithubUser } from "@/lib/identity"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { nodeDefinitions } from "@/nodes/registry"
import { Icon } from "@/components/icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { presenceLabel, usePresence } from "@/lib/use-presence"
import { Bar, BarButton, BarGroup, BarSeparator } from "./bar"
import { NodeMenu } from "./node-menu"
import { COOL_STICKER_TOOL, CoolStickerPicker } from "./cool-sticker-picker"
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
/** The node types that have their own picker in the bar, so they are not in "More nodes". */
const OWN_PICKER_TOOLS = [COOL_STICKER_TOOL]

const moreDefinitions = nodeDefinitions.filter(
  (definition) => !PINNED_TOOLS.includes(definition.type) && !OWN_PICKER_TOOLS.includes(definition.type),
)

/** The theme is saved in this browser only. Each person picks their own theme. */
const THEME_KEY = "whiteboard-theme"

function readDarkTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark"
  } catch {
    return false
  }
}

function saveDarkTheme(dark: boolean) {
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light")
  } catch {
    // Storage is blocked. The theme then works until the next reload.
  }
}

/**
 * The bar at the top left: board title, tools, the number of people online, and the avatar.
 * The tools come from the node registry. A new node shows in the "More nodes" menu.
 */
function TopBar() {
  const title = useBoardStore((state) => state.title)
  const tool = useBoardStore((state) => state.tool)
  const setTool = useBoardStore((state) => state.setTool)
  const setTitle = useBoardStore((state) => state.setTitle)
  const zoomToFit = useBoardStore((state) => state.zoomToFit)
  const githubUser = useGithubUser()
  const gridStyle = useGridStyle((state) => state.gridStyle)
  const setGridStyle = useGridStyle((state) => state.setGridStyle)
  const [dialog, setDialog] = useState<"rename" | "name" | null>(null)
  const presence = usePresence()
  const [dark, setDark] = useState(readDarkTheme)

  // A layout effect sets the class before the first paint, so the board does not flash.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  const changeTheme = (next: boolean) => {
    setDark(next)
    saveDarkTheme(next)
  }

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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon icon={GridIcon} /> Grid
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent data-board-ui className="w-32">
                  <DropdownMenuRadioGroup
                    value={gridStyle}
                    onValueChange={(value) => setGridStyle(value as GridStyle)}
                  >
                    {GRID_STYLES.map((style) => (
                      <DropdownMenuRadioItem key={style.value} value={style.value} closeOnClick>
                        {style.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuCheckboxItem checked={dark} onCheckedChange={changeTheme}>
                <Icon icon={Moon02Icon} /> Dark theme
              </DropdownMenuCheckboxItem>
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
          <CoolStickerPicker />
          {moreDefinitions.length > 0 && (
            <NodeMenu definitions={moreDefinitions} activeType={tool} onPick={setTool} />
          )}
        </BarGroup>

        <BarSeparator />

        <BarGroup className="p-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <div
                  data-slot="top-bar-presence"
                  role="status"
                  tabIndex={0}
                  aria-label={presenceLabel(presence)}
                  className="flex h-8 items-center gap-1 rounded-sm px-2 text-sm font-medium tabular-nums text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              <Icon icon={UserMultipleIcon} className="size-4" />
              {presence.count}
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={8}>
              {presenceLabel(presence)}
            </TooltipContent>
          </Tooltip>
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
