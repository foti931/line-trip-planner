create table if not exists public.trip_plans (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.trip_plans enable row level security;

drop policy if exists "trip_plans_select" on public.trip_plans;
create policy "trip_plans_select"
on public.trip_plans
for select
to anon
using (true);

drop policy if exists "trip_plans_insert" on public.trip_plans;
create policy "trip_plans_insert"
on public.trip_plans
for insert
to anon
with check (true);

drop policy if exists "trip_plans_update" on public.trip_plans;
create policy "trip_plans_update"
on public.trip_plans
for update
to anon
using (true)
with check (true);
