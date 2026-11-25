import { useEffect, useId, useRef, useState } from "react"
import { PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { AnyNodeDefinition } from "@/nodes/define-node"

/** Keep the node types whose label or author contains the query. Case does not matter. */
function filterNodeDefinitions(definitions: AnyNodeDefinition[], query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return definitions
  return definitions.filter(
    (definition) =>
      definition.label.toLowerCase().includes(needle) ||
      definition.author.toLowerCase().includes(needle),
  )
}

type NodeMenuProps = {
  /** The node types to show in the menu. */
  definitions: AnyNodeDefinition[]
  /** The current tool. The trigger looks active when it is one of the definitions. */
  activeType: string
  /** Called with the type of the node that the person picks. */
  onPick: (type: string) => void
}

/**
 * The "More nodes" menu of the top bar, with a search input at the top.
 * The input has the focus when the menu opens. Arrow keys move in the list, Enter picks.
 */
function NodeMenu({ definitions, activeType, onPick }: NodeMenuProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const matches = filterNodeDefinitions(definitions, query)
  const activeDefinition = matches[activeIndex]
  const optionId = (type: string) => `${listId}-${type}`

  useEffect(() => {
    if (!activeDefinition) return
    document.getElementById(optionId(activeDefinition.type))?.scrollIntoView?.({ block: "nearest" })
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
      setActiveIndex(0)
    }
  }

  function pick(type: string) {
    onPick(type)
    handleOpenChange(false)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (matches.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % matches.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + matches.length) % matches.length)
    } else if (event.key === "Enter" && activeDefinition) {
      event.preventDefault()
      pick(activeDefinition.type)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            data-slot="node-menu-trigger"
            variant="ghost"
            size="icon"
            aria-label="More nodes"
            title="More nodes"
            data-active={definitions.some((definition) => definition.type === activeType) || undefined}
            className="rounded-sm text-foreground data-active:border-border data-active:bg-muted data-active:shadow-flat [&_svg:not([class*='size-'])]:size-5"
          />
        }
      >
        <Icon icon={PlusSignIcon} />
      </PopoverTrigger>
      <PopoverContent
        data-board-ui
        data-slot="node-menu"
        align="start"
        sideOffset={12}
        initialFocus={inputRef}
        className="max-h-96 w-64 gap-1 p-1"
      >
        <div className="relative m-1 mb-0">
          <Icon
            icon={Search01Icon}
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search nodes"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeDefinition ? optionId(activeDefinition.type) : undefined}
            placeholder="Search by name or author"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="h-8 w-full min-w-0 rounded-sm border border-input bg-transparent pr-2 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <p className="px-1.5 pt-1 text-xs font-medium text-muted-foreground">
          More nodes ({query.trim() ? `${matches.length} of ${definitions.length}` : definitions.length})
        </p>

        {matches.length === 0 ? (
          <p role="status" className="px-1.5 py-3 text-center text-sm text-muted-foreground">
            No node matches "{query.trim()}".
          </p>
        ) : (
          <div id={listId} role="listbox" aria-label="More nodes" className="min-h-0 overflow-y-auto">
            {matches.map((definition, index) => (
              <div
                key={definition.type}
                id={optionId(definition.type)}
                role="option"
                aria-selected={index === activeIndex}
                data-active={index === activeIndex || undefined}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => pick(definition.type)}
                className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm select-none data-active:bg-accent data-active:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <Icon icon={definition.icon} />
                <span className="truncate">{definition.label}</span>
                <span className="ml-auto truncate text-xs text-muted-foreground">{definition.author}</span>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { NodeMenu, filterNodeDefinitions }
