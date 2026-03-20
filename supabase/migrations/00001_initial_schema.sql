-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users table (synced from Supabase Auth)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Roadmaps
create table public.roadmaps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null default 'Untitled Roadmap',
  slug text unique not null,
  visibility text not null default 'public' check (visibility in ('public', 'private', 'unlisted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Columns
create table public.columns (
  id uuid primary key default uuid_generate_v4(),
  roadmap_id uuid references public.roadmaps(id) on delete cascade not null,
  title text not null,
  position integer not null default 0
);

-- Cards
create table public.cards (
  id uuid primary key default uuid_generate_v4(),
  column_id uuid references public.columns(id) on delete cascade not null,
  roadmap_id uuid references public.roadmaps(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'done')),
  tag text,
  position integer not null default 0
);

-- Indexes
create index idx_roadmaps_user_id on public.roadmaps(user_id);
create index idx_roadmaps_slug on public.roadmaps(slug);
create index idx_columns_roadmap_id on public.columns(roadmap_id);
create index idx_cards_column_id on public.cards(column_id);
create index idx_cards_roadmap_id on public.cards(roadmap_id);

-- RLS Policies
alter table public.users enable row level security;
alter table public.roadmaps enable row level security;
alter table public.columns enable row level security;
alter table public.cards enable row level security;

-- Users: can read own row
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

-- Roadmaps: owner full access, public/unlisted readable by all
create policy "Owner full access to roadmaps" on public.roadmaps
  for all using (auth.uid() = user_id);

create policy "Public roadmaps readable by all" on public.roadmaps
  for select using (visibility in ('public', 'unlisted'));

-- Columns: owner full access via roadmap, public readable
create policy "Owner full access to columns" on public.columns
  for all using (
    exists (
      select 1 from public.roadmaps
      where roadmaps.id = columns.roadmap_id
      and roadmaps.user_id = auth.uid()
    )
  );

create policy "Public columns readable" on public.columns
  for select using (
    exists (
      select 1 from public.roadmaps
      where roadmaps.id = columns.roadmap_id
      and roadmaps.visibility in ('public', 'unlisted')
    )
  );

-- Cards: owner full access via roadmap, public readable
create policy "Owner full access to cards" on public.cards
  for all using (
    exists (
      select 1 from public.roadmaps
      where roadmaps.id = cards.roadmap_id
      and roadmaps.user_id = auth.uid()
    )
  );

create policy "Public cards readable" on public.cards
  for select using (
    exists (
      select 1 from public.roadmaps
      where roadmaps.id = cards.roadmap_id
      and roadmaps.visibility in ('public', 'unlisted')
    )
  );

-- Enable Realtime for cards and columns
alter publication supabase_realtime add table public.cards;
alter publication supabase_realtime add table public.columns;

-- Updated_at trigger for roadmaps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger roadmaps_updated_at
  before update on public.roadmaps
  for each row execute procedure public.update_updated_at();

-- Grant table permissions
grant select, insert, update, delete on public.roadmaps to authenticated;
grant select, insert, update, delete on public.columns to authenticated;
grant select, insert, update, delete on public.cards to authenticated;
grant select on public.users to authenticated;

grant select on public.roadmaps to anon;
grant select on public.columns to anon;
grant select on public.cards to anon;
