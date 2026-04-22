-- Clerk-тэй агентуудыг `agents` хүснэгтэд холбох (upsert / resolve).
alter table public.agents
  add column if not exists clerk_user_id text;

create unique index if not exists agents_clerk_user_id_uidx
  on public.agents (clerk_user_id)
  where clerk_user_id is not null;

comment on column public.agents.clerk_user_id is 'Clerk user id (user_...) — нэг Clerk = нэг agents мөр.';
