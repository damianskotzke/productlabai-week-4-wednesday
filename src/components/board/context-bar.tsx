import { useState } from "react"
import {
  ArrowDown01Icon,
  DashedLine01Icon,
  Delete02Icon,
  EraserIcon,
  HelpCircleIcon,
  LayerBringToFrontIcon,
  MoreHorizontalIcon,
  SmileIcon,
  SolidLine01Icon,
  Tag01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { toScreen } from "@/canvas/geometry"
import { useBoardStore } from "@/canvas/store"
import type { Reaction, ReactionKind, Tag as TagData } from "@/canvas/types"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getMyId } from "@/lib/identity"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getNodeDefinition, nodeDefinitions } from "@/nodes/registry"
import { Bar, BarButton, BarGroup, BarSeparator } from "./bar"
import { REACTIONS, ReactionBadge, randomEdgePlacement } from "./node-decorations"

const BAR_HEIGHT = 42
const GAP = 10
const iconButton = "rounded-sm text-foreground [&_svg:not([class*='size-'])]:size-5"

/**
 * The small bar above the selected node or connector.
 * A node type can add its own controls with `toolbar` in its definition.
 */
function ContextBar() {
  const selection = useBoardStore((state) => state.selection)
  if (selection?.kind === "node") return <NodeContextBar id={selection.id} />
  if (selection?.kind === "edge") return <EdgeContextBar id={selection.id} />
  return null
}

function NodeContextBar({ id }: { id: string }) {
  const node = useBoardStore((state) => state.nodes[id])
  const view = useBoardStore((state) => state.view)
  const editing = useBoardStore((state) => state.editingId === id)
  const updateNodeData = useBoardStore((state) => state.updateNodeData)
  const changeNodeType = useBoardStore((state) => state.changeNodeType)
  const bringToFront = useBoardStore((state) => state.bringToFront)
  const commitNode = useBoardStore((state) => state.commitNode)
  const removeNode = useBoardStore((state) => state.removeNode)
  const setEditing = useBoardStore((state) => state.setEditing)
  const [tagOpen, setTagOpen] = useState(false)

  if (!node) return null
  const definition = getNodeDefinition(node.type)
  const NodeToolbar = definition?.toolbar
  const reactions: Reaction[] = node.data.reactions ?? []
  const tags: TagData[] = node.data.tags ?? []

  // The bar is in screen pixels: it does not grow when the board zooms.
  const top = toScreen(view, { x: node.x + node.width / 2, y: node.y })
  const bottom = toScreen(view, { x: node.x, y: node.y + node.height })
  const above = top.y - BAR_HEIGHT - GAP
  const y = above < 64 ? bottom.y + GAP : above

  // One reaction of each kind for each person. A second click takes it back.
  const me = getMyId()
  const isMine = (reaction: Reaction, kind: ReactionKind) => reaction.kind === kind && reaction.by === me
  const toggleReaction = (kind: ReactionKind) =>
    updateNodeData(id, {
      reactions: reactions.some((reaction) => isMine(reaction, kind))
        ? reactions.filter((reaction) => !isMine(reaction, kind))
        : [...reactions, { kind, by: me, ...randomEdgePlacement(["left", "right", "top", "bottom"]) }],
    })
  const addTag = (text: string) =>
    updateNodeData(id, { tags: [...tags, { text, ...randomEdgePlacement(["top", "bottom"]) }] })

  return (
    <Bar
      data-slot="context-bar"
      role="toolbar"
      aria-label="Node tools"
      className="-translate-x-1/2"
      style={{ left: top.x, top: y }}
    >
      <BarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                aria-label="Change node type"
                title="Change node type"
                className="h-8 gap-0.5 rounded-sm px-1.5 text-foreground [&_svg:not([class*='size-'])]:size-5"
              />
            }
          >
            <Icon icon={definition?.icon ?? HelpCircleIcon} />
            <Icon icon={ArrowDown01Icon} className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-board-ui
            side="top"
            align="start"
            sideOffset={12}
            className="max-h-80 w-52"
          >
            {nodeDefinitions.map((option) => (
              <DropdownMenuItem
                key={option.type}
                disabled={option.type === node.type}
                onClick={() => changeNodeType(id, option.type)}
              >
                <Icon icon={option.icon} />
                <span className="truncate">{option.label}</span>
                {option.type === node.type && <Icon icon={Tick02Icon} className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BarGroup>
      <BarSeparator />
      <BarGroup>
        <Popover open={tagOpen} onOpenChange={setTagOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add tag"
                title="Add tag"
                className={iconButton}
              />
            }
          >
            <Icon icon={Tag01Icon} />
          </PopoverTrigger>
          <PopoverContent data-board-ui side="top" sideOffset={12} className="w-56 p-2">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                const input = event.currentTarget.elements.namedItem("tag") as HTMLInputElement
                if (input.value.trim()) addTag(input.value.trim())
                setTagOpen(false)
              }}
            >
              <Input
                name="tag"
                autoFocus
                maxLength={24}
                placeholder="Tag, then Enter"
                aria-label="Tag text"
              />
            </form>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Add reaction"
                title="Add reaction"
                className={iconButton}
              />
            }
          >
            <Icon icon={SmileIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-board-ui
            side="top"
            sideOffset={12}
            className="grid w-auto min-w-0 grid-cols-4 gap-1 p-1.5"
          >
            {(Object.keys(REACTIONS) as ReactionKind[]).map((kind) => {
              const given = reactions.some((reaction) => isMine(reaction, kind))
              return (
                <DropdownMenuItem
                  key={kind}
                  aria-label={given ? `Remove ${REACTIONS[kind].label}` : REACTIONS[kind].label}
                  aria-pressed={given}
                  closeOnClick={false}
                  className="justify-center rounded-full p-1 aria-pressed:bg-muted aria-pressed:ring-2 aria-pressed:ring-selection"
                  onClick={() => toggleReaction(kind)}
                >
                  <ReactionBadge kind={kind} />
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {NodeToolbar && (
          <NodeToolbar
            id={id}
            data={node.data}
            width={node.width}
            height={node.height}
            selected
            editing={editing}
            updateData={(patch: Record<string, unknown>) => updateNodeData(id, patch)}
            stopEditing={() => setEditing(null)}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="More" title="More" className={iconButton} />
            }
          >
            <Icon icon={MoreHorizontalIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-board-ui
            side="top"
            align="end"
            sideOffset={12}
            className="w-auto whitespace-nowrap"
          >
            <DropdownMenuItem
              onClick={() => {
                bringToFront(id)
                commitNode(id)
              }}
            >
              <Icon icon={LayerBringToFrontIcon} /> Bring to front
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={reactions.length === 0 && tags.length === 0}
              onClick={() => updateNodeData(id, { reactions: [], tags: [] })}
            >
              <Icon icon={EraserIcon} /> Clear tags and reactions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => removeNode(id)}>
              <Icon icon={Delete02Icon} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BarGroup>
    </Bar>
  )
}

function EdgeContextBar({ id }: { id: string }) {
  const edge = useBoardStore((state) => state.edges[id])
  const source = useBoardStore((state) => (edge ? state.nodes[edge.source] : undefined))
  const target = useBoardStore((state) => (edge ? state.nodes[edge.target] : undefined))
  const view = useBoardStore((state) => state.view)
  const updateEdge = useBoardStore((state) => state.updateEdge)
  const removeEdge = useBoardStore((state) => state.removeEdge)

  if (!edge || !source || !target) return null
  const middle = toScreen(view, {
    x: (source.x + source.width / 2 + target.x + target.width / 2) / 2,
    y: (source.y + source.height / 2 + target.y + target.height / 2) / 2,
  })

  return (
    <Bar
      data-slot="context-bar"
      role="toolbar"
      aria-label="Connector tools"
      className="-translate-x-1/2"
      style={{ left: middle.x, top: middle.y - BAR_HEIGHT - GAP }}
    >
      <BarGroup>
        <BarButton
          label={edge.dashed ? "Make solid" : "Make dashed"}
          onClick={() => updateEdge(id, { dashed: !edge.dashed })}
        >
          <Icon icon={edge.dashed ? SolidLine01Icon : DashedLine01Icon} />
        </BarButton>
        <BarButton label="Delete connector" onClick={() => removeEdge(id)}>
          <Icon icon={Delete02Icon} />
        </BarButton>
      </BarGroup>
    </Bar>
  )
}

export { ContextBar }
