-- Class whiteboard: boards, nodes, connectors and the file bucket.
--
-- There is NO authentication in this project (it is out of scope).
-- The policies below let every person with the publishable key read and
-- write all rows. Do not put private data on the board.
--
-- A new node type does NOT need a migration: its fields go in `data` (jsonb).

create table if not exists public.wb_boards (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled board',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wb_nodes (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.wb_boards (id) on delete cascade,
  -- The `type` of a node definition in src/nodes/<type>/index.ts
  type text not null,
  x double precision not null default 0,
  y double precision not null default 0,
  width double precision not null default 240,
  height double precision not null default 240,
  -- Stack order. A higher number is nearer to the front.
  z_index double precision not null default 0,
  -- The fields of the node type, plus the shared `reactions` and `tags`.
  data jsonb not null default '{}'::jsonb,
  -- Nickname of the person who made the node. Not verified.
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wb_edges (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.wb_boards (id) on delete cascade,
  source_id uuid not null references public.wb_nodes (id) on delete cascade,
  target_id uuid not null references public.wb_nodes (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wb_nodes_board_id_idx on public.wb_nodes (board_id);
create index if not exists wb_edges_board_id_idx on public.wb_edges (board_id);
create index if not exists wb_edges_source_id_idx on public.wb_edges (source_id);
create index if not exists wb_edges_target_id_idx on public.wb_edges (target_id);

-- Keep `updated_at` correct.
create or replace function public.wb_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wb_boards_touch on public.wb_boards;
create trigger wb_boards_touch before update on public.wb_boards
  for each row execute function public.wb_touch_updated_at();
drop trigger if exists wb_nodes_touch on public.wb_nodes;
create trigger wb_nodes_touch before update on public.wb_nodes
  for each row execute function public.wb_touch_updated_at();
drop trigger if exists wb_edges_touch on public.wb_edges;
create trigger wb_edges_touch before update on public.wb_edges
  for each row execute function public.wb_touch_updated_at();

-- Row Level Security: on, with open policies (no authentication).
alter table public.wb_boards enable row level security;
alter table public.wb_nodes enable row level security;
alter table public.wb_edges enable row level security;

drop policy if exists "wb_boards: all people can read" on public.wb_boards;
create policy "wb_boards: all people can read" on public.wb_boards
  for select to anon, authenticated using (true);
drop policy if exists "wb_boards: all people can rename" on public.wb_boards;
create policy "wb_boards: all people can rename" on public.wb_boards
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "wb_nodes: all people can read and write" on public.wb_nodes;
create policy "wb_nodes: all people can read and write" on public.wb_nodes
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "wb_edges: all people can read and write" on public.wb_edges;
create policy "wb_edges: all people can read and write" on public.wb_edges
  for all to anon, authenticated using (true) with check (true);

grant select, update on public.wb_boards to anon, authenticated;
grant select, insert, update, delete on public.wb_nodes to anon, authenticated;
grant select, insert, update, delete on public.wb_edges to anon, authenticated;

-- Realtime: send each change to all open boards.
-- "replica identity full" lets Realtime filter DELETE events by board.
alter table public.wb_nodes replica identity full;
alter table public.wb_edges replica identity full;

do $$
declare
  board_table text;
begin
  foreach board_table in array array['wb_boards', 'wb_nodes', 'wb_edges'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = board_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', board_table);
    end if;
  end loop;
end;
$$;

-- The one board of the class. `pnpm db:reset` fills it with the seed nodes.
insert into public.wb_boards (id, title)
values ('00000000-0000-4000-8000-000000000001', 'Redo: Community Portal')
on conflict (id) do nothing;

-- File storage: one public bucket for images, 5 MB for each file.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'board-files',
  'board-files',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "board-files: all people can read" on storage.objects;
create policy "board-files: all people can read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'board-files');
drop policy if exists "board-files: all people can upload" on storage.objects;
create policy "board-files: all people can upload" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'board-files');
