-- Round 2 content pass: demo video requirement + project URL now optional.
-- Already applied to serialfounder-2 via the Management API.

-- Required demo-video link (Loom/YouTube/Drive/any public URL) collected at submission.
alter table public.hackathon_projects add column if not exists demo_video_url text;

-- Public deploy is no longer required for round 2 — project URL becomes optional.
alter table public.hackathon_projects alter column project_url drop not null;
