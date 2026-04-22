-- «Агентаар заруулах» → searching_agent; агент «Би заръя» → agent_saling + listings published.
-- agent_posted: агент энэ зарыг өөрөө зарж борлуулна гэсэн бүртгэл (порталын "Миний зарууд").
create table if not exists public.agent_saling (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null references public.agents (id) on delete cascade,
  listing_id text not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  agent_posted boolean not null default true,
  unique (agent_id, listing_id)
);

create index if not exists agent_saling_agent_id_idx on public.agent_saling (agent_id);
create index if not exists agent_saling_listing_id_idx on public.agent_saling (listing_id);

alter table public.agent_saling enable row level security;
