-- Serial Founders BR — fresh schema for serialfounder-2 (round 2 ready)
-- Derived from frontend code usage. Round-2 columns folded directly into CREATE TABLE.
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS / ON CONFLICT).

-- =====================================================================
-- hackathon_projects
-- =====================================================================
create table if not exists public.hackathon_projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  name              text not null,
  slug              text not null unique,
  short_description text not null,
  full_description  text,
  how_it_was_built  text,
  project_url       text not null,
  github_url        text,
  screenshot_url    text,
  team_members      jsonb not null default '[]'::jsonb,
  is_solo           boolean not null default true,
  social_handle     text,
  -- entry / payment
  paid_entry        boolean not null default false,  -- round 1 (R$20); unused in round 2
  entry_shared      boolean not null default false,  -- round 2: "I reposted the announcement video"
  entry_proof_url   text,                            -- round 2: optional repost link
  -- round scoping
  round             integer not null default 2,
  -- submission state
  is_submitted      boolean not null default false,
  submitted_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index  if not exists idx_hp_round      on public.hackathon_projects(round);
create index  if not exists idx_hp_user       on public.hackathon_projects(user_id);
create index  if not exists idx_hp_submitted  on public.hackathon_projects(is_submitted);
-- one project per user per round (fixes returning-participant blocker at the DB level)
create unique index if not exists uq_hp_user_round on public.hackathon_projects(user_id, round);

alter table public.hackathon_projects enable row level security;
grant select on public.hackathon_projects to anon, authenticated;
grant insert, update, delete on public.hackathon_projects to authenticated;

drop policy if exists hp_select_public on public.hackathon_projects;
create policy hp_select_public on public.hackathon_projects for select using (true);
drop policy if exists hp_insert_own on public.hackathon_projects;
create policy hp_insert_own on public.hackathon_projects for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists hp_update_own on public.hackathon_projects;
create policy hp_update_own on public.hackathon_projects for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists hp_delete_own on public.hackathon_projects;
create policy hp_delete_own on public.hackathon_projects for delete to authenticated using (auth.uid() = user_id);

-- =====================================================================
-- hackathon_votes  (round 1 voting; kept so currently-deployed code doesn't error.
--                   Round 2 has no public voting — UI will be removed in the frontend.)
-- =====================================================================
create table if not exists public.hackathon_votes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  project_id  uuid not null references public.hackathon_projects(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, project_id)
);
create index if not exists idx_hv_project on public.hackathon_votes(project_id);
create index if not exists idx_hv_user    on public.hackathon_votes(user_id);

alter table public.hackathon_votes enable row level security;
grant select on public.hackathon_votes to anon, authenticated;
grant insert, delete on public.hackathon_votes to authenticated;

drop policy if exists hv_select_public on public.hackathon_votes;
create policy hv_select_public on public.hackathon_votes for select using (true);
drop policy if exists hv_insert_own on public.hackathon_votes;
create policy hv_insert_own on public.hackathon_votes for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists hv_delete_own on public.hackathon_votes;
create policy hv_delete_own on public.hackathon_votes for delete to authenticated using (auth.uid() = user_id);

-- =====================================================================
-- ranking_members / ranking_snapshots  (community gamification: public read, service-role write)
-- =====================================================================
create table if not exists public.ranking_members (
  id              uuid primary key default gen_random_uuid(),
  whatsapp_id     text unique,
  phone           text,
  display_name    text not null,
  full_name       text,
  joined_group_at timestamptz,
  total_points    integer not null default 0,
  current_tier    text    not null default 'Estagiario',
  rank_position   integer,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_active_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_rm_points   on public.ranking_members(total_points desc);
create index if not exists idx_rm_position on public.ranking_members(rank_position);

create table if not exists public.ranking_snapshots (
  id              uuid primary key default gen_random_uuid(),
  member_id       uuid references public.ranking_members(id) on delete cascade,
  week_start      date not null,
  messages_sent   integer not null default 0,
  replies_given   integer not null default 0,
  threads_started integer not null default 0,
  links_shared    integer not null default 0,
  ai_score        integer not null default 0,
  points_earned   integer not null default 0,
  rank_position   integer,
  tier            text,
  position_change integer,
  created_at      timestamptz not null default now(),
  unique (member_id, week_start)
);
create index if not exists idx_rs_week   on public.ranking_snapshots(week_start desc);
create index if not exists idx_rs_member on public.ranking_snapshots(member_id);

alter table public.ranking_members   enable row level security;
alter table public.ranking_snapshots enable row level security;
grant select on public.ranking_members, public.ranking_snapshots to anon, authenticated;

drop policy if exists rm_select_public on public.ranking_members;
create policy rm_select_public on public.ranking_members for select using (true);
drop policy if exists rs_select_public on public.ranking_snapshots;
create policy rs_select_public on public.ranking_snapshots for select using (true);

-- =====================================================================
-- storage bucket: hackathon-screenshots (public read, authenticated upload to own /<uid>/ folder)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('hackathon-screenshots', 'hackathon-screenshots', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists hs_public_read on storage.objects;
create policy hs_public_read on storage.objects
  for select using (bucket_id = 'hackathon-screenshots');

drop policy if exists hs_auth_insert_own on storage.objects;
create policy hs_auth_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'hackathon-screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists hs_auth_update_own on storage.objects;
create policy hs_auth_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'hackathon-screenshots' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists hs_auth_delete_own on storage.objects;
create policy hs_auth_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'hackathon-screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
