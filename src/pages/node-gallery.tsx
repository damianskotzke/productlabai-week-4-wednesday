import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icon"
import { NodeErrorBoundary } from "@/components/board/node-shell"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { nodeDefinitions } from "@/nodes/registry"

/**
 * `/nodes`: each node type alone, with its default data.
 * Use this page to check your node and to make a screenshot for your PR.
 */
function NodeGallery() {
  return (
    <main data-slot="node-gallery" className="h-full overflow-auto bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
        <header className="flex flex-col gap-3">
          <a href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "self-start")}>
            <Icon icon={ArrowLeft01Icon} /> Back to the board
          </a>
          <h1 className="text-2xl font-medium">Node gallery</h1>
          <p className="text-sm text-muted-foreground">
            {nodeDefinitions.length} node types. Each folder in <code>src/nodes</code> is one node type.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {nodeDefinitions.map((definition) => (
            <li
              key={definition.type}
              data-node-type={definition.type}
              className="flex flex-col gap-4 rounded-xl border bg-background p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border bg-muted">
                  <Icon icon={definition.icon} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-medium">
                    {definition.label}{" "}
                    <code className="font-normal text-muted-foreground">{definition.type}</code>
                  </h2>
                  <p className="text-sm text-muted-foreground">{definition.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{definition.author}</span>
              </div>
              <div className="flex min-h-64 items-center justify-center overflow-auto rounded-lg border border-dashed p-6">
                {/* `group/node` is the same wrapper that the board shell gives. */}
                <div className="group/node relative shrink-0" style={definition.defaultSize}>
                  <NodeErrorBoundary type={definition.type}>
                    <definition.component
                      id={`gallery-${definition.type}`}
                      data={definition.defaultData}
                      width={definition.defaultSize.width}
                      height={definition.defaultSize.height}
                      selected={false}
                      editing={false}
                      updateData={() => {}}
                      stopEditing={() => {}}
                    />
                  </NodeErrorBoundary>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export { NodeGallery }
