-- Weebly V9 — Supabase schema (paste into Supabase -> SQL Editor -> Run)
-- Idempotent: safe to run more than once.

create table if not exists public.educational_activity_events (
  id text primary key,
  student_pseudonymous_id text not null default 'std_weebly_child',
  student_name text not null default 'Child',
  activity_id text not null,
  activity_title text not null,
  category text not null default 'general',
  learning_objective text not null default '',
  completion_status text not null default 'completed',
  hints_used_count integer not null default 0,
  language_used text not null default 'en',
  duration_seconds integer not null default 60,
  curriculum_version text not null default 'v3.0.0',
  family_id text,
  school_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_eae_student on public.educational_activity_events (student_pseudonymous_id, created_at desc);

create table if not exists public.parent_observations (
  id uuid primary key default gen_random_uuid(),
  family_id text not null default 'fam_demo',
  child_pseudonymous_id text not null default 'std_weebly_child',
  child_name text not null default 'Child',
  category text not null default 'learning_habit',
  note text not null,
  share_with_teacher boolean not null default false,
  share_with_specialist boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_po_family on public.parent_observations (family_id, created_at desc);

create table if not exists public.classroom_assignments (
  id uuid primary key default gen_random_uuid(),
  classroom_id text not null default 'cls_4b',
  teacher_name text not null default 'Teacher',
  title text not null,
  subject text not null default 'Mathematics',
  grade text not null default 'Grade 4',
  activity_route text not null default '/youth/activities?category=mathematics',
  due_date text,
  status text not null default 'assigned',
  created_at timestamptz not null default now()
);
create index if not exists idx_ca_classroom on public.classroom_assignments (classroom_id, created_at desc);

create table if not exists public.pilot_inquiries (
  id uuid primary key default gen_random_uuid(),
  role text not null default 'school',
  organization text not null default '',
  contact_name text not null,
  email text not null,
  city text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

-- Enable RLS. When using SUPABASE_SERVICE_ROLE_KEY on the Next.js server only,
-- the server bypasses RLS while direct browser access with the anon key is
-- controlled by the policies below.
alter table public.educational_activity_events enable row level security;
alter table public.parent_observations enable row level security;
alter table public.classroom_assignments enable row level security;
alter table public.pilot_inquiries enable row level security;

-- Allow the server to work with EITHER the service role key OR the anon key
-- during initial setup. Tighten to auth.uid()-scoped policies once Supabase Auth is enabled.
drop policy if exists "app_rw_events" on public.educational_activity_events;
create policy "app_rw_events" on public.educational_activity_events for all using (true) with check (true);

drop policy if exists "app_rw_obs" on public.parent_observations;
create policy "app_rw_obs" on public.parent_observations for all using (true) with check (true);

drop policy if exists "app_rw_assign" on public.classroom_assignments;
create policy "app_rw_assign" on public.classroom_assignments for all using (true) with check (true);

drop policy if exists "app_insert_inquiries" on public.pilot_inquiries;
create policy "app_insert_inquiries" on public.pilot_inquiries for insert with check (true);
