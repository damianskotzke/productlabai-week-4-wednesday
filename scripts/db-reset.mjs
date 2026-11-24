// Put the seed board back: `pnpm db:reset`
//
// This DELETES all nodes and connectors of the class board, then loads
// supabase/seed-board.json. Use it before a lesson, or after a mess.
import { readFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => [line.slice(0, line.indexOf("=")).trim(), line.slice(line.indexOf("=") + 1).trim()]),
)

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local first.")
  process.exit(1)
}

const boardId = env.VITE_BOARD_ID ?? "00000000-0000-4000-8000-000000000001"
const seed = JSON.parse(readFileSync(new URL("../supabase/seed-board.json", import.meta.url), "utf8"))
const supabase = createClient(url, key)

function check(step, { error }) {
  if (error) {
    console.error(`${step} failed: ${error.message}`)
    process.exit(1)
  }
}

// Connectors go away with their nodes (on delete cascade).
check("Delete nodes", await supabase.from("wb_nodes").delete().eq("board_id", boardId))
check("Set title", await supabase.from("wb_boards").update({ title: seed.title }).eq("id", boardId))
check(
  "Insert nodes",
  await supabase.from("wb_nodes").insert(
    seed.nodes.map((node) => ({
      id: node.id,
      board_id: boardId,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      z_index: node.z,
      data: node.data,
      created_by: node.createdBy,
    })),
  ),
)
check(
  "Insert connectors",
  await supabase.from("wb_edges").insert(
    seed.edges.map((edge) => ({
      id: edge.id,
      board_id: boardId,
      source_id: edge.source,
      target_id: edge.target,
      data: { dashed: edge.dashed },
    })),
  ),
)

console.log(`Done. The board has ${seed.nodes.length} nodes and ${seed.edges.length} connectors.`)
