-- A: RLS + индекс + саналын unique + view_count atomic RPC + аюулгүй байдлын засварууд.

-- ---------------------------------------------------------------------------
-- Үл ашиглагдсан хүснэгтүүд (код дээр reference алга)
-- ---------------------------------------------------------------------------
drop table if exists public.listing_nearby_services cascade;
drop table if exists public.nearby_service_catalog cascade;
drop table if exists public.sale_listing_claims cascade;

-- ---------------------------------------------------------------------------
-- Индексүүд (FK + list filter)
-- ---------------------------------------------------------------------------
create index if not exists idx_listings_agent_id on public.listings (agent_id);
create index if not exists idx_listings_selected_agent_id on public.listings (selected_agent_id);
create index if not exists idx_agents_profile_id on public.agents (profile_id);
create index if not exists idx_buy_requests_assigned_agent_id on public.buy_requests (assigned_agent_id);
create index if not exists idx_property_images_uploaded_by on public.property_images (uploaded_by_profile_id);
create index if not exists idx_searching_agent_user_id on public.searching_agent (user_id);
create index if not exists idx_buy_req_recs_listing_id on public.buy_request_recommendations (listing_id);

-- ---------------------------------------------------------------------------
-- buy_request_recommendations: давхар саналыг DB түвшинд хориглох
-- ---------------------------------------------------------------------------
delete from public.buy_request_recommendations a
  using public.buy_request_recommendations b
 where a.ctid < b.ctid
   and a.buy_request_id = b.buy_request_id
   and a.listing_id = b.listing_id
   and a.agent_id is not distinct from b.agent_id;

alter table public.buy_request_recommendations
  drop constraint if exists buy_request_recommendations_buy_request_listing_agent_key;

alter table public.buy_request_recommendations
  add constraint buy_request_recommendations_buy_request_listing_agent_key
  unique (buy_request_id, listing_id, agent_id);

-- ---------------------------------------------------------------------------
-- Үзэлт: race-condition-гүй atom increment (updated_at үл хөдөлнө)
-- ---------------------------------------------------------------------------
create or replace function public.increment_listing_view(p_id text)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.listings
     set view_count = coalesce(view_count, 0) + 1
   where id = p_id
   returning view_count;
$$;

revoke all on function public.increment_listing_view(text) from public;
grant execute on function public.increment_listing_view(text) to service_role;

-- ---------------------------------------------------------------------------
-- profiles trigger функцийн search_path
-- ---------------------------------------------------------------------------
alter function public.set_profiles_updated_at() set search_path = '';

-- ---------------------------------------------------------------------------
-- rls_auto_enable: anon/authenticated-аас RPC дуудагдахыг хаах
-- ---------------------------------------------------------------------------
revoke execute on function public.rls_auto_enable() from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Хувийн хүснэгтүүд: anon/authenticated шууд хандах эрхгүй (API нь service_role)
-- ---------------------------------------------------------------------------
revoke select, insert, update, delete on public.profiles from anon, authenticated;
revoke select, insert, update, delete on public.saved_listings from anon, authenticated;
revoke select, insert, update, delete on public.searching_agent from anon, authenticated;
revoke select, insert, update, delete on public.agent_saling from anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS policy: нийтийн унших (anon + authenticated)
-- ---------------------------------------------------------------------------
grant select on public.listings to anon, authenticated;
grant select on public.agents to anon, authenticated;
grant select on public.buy_requests to anon, authenticated;
grant select on public.buy_request_recommendations to anon, authenticated;
grant select on public.property_images to anon, authenticated;

drop policy if exists listings_public_read on public.listings;
create policy listings_public_read
  on public.listings
  for select
  to anon, authenticated
  using (workflow_status = 'published');

drop policy if exists agents_public_read on public.agents;
create policy agents_public_read
  on public.agents
  for select
  to anon, authenticated
  using (true);

drop policy if exists buy_requests_public_read on public.buy_requests;
create policy buy_requests_public_read
  on public.buy_requests
  for select
  to anon, authenticated
  using (workflow_status in ('open', 'in_progress'));

drop policy if exists buy_request_recommendations_public_read on public.buy_request_recommendations;
create policy buy_request_recommendations_public_read
  on public.buy_request_recommendations
  for select
  to anon, authenticated
  using (
    exists (
      select 1
        from public.buy_requests br
       where br.id = buy_request_id
         and br.workflow_status in ('open', 'in_progress')
    )
  );

drop policy if exists property_images_public_read on public.property_images;
create policy property_images_public_read
  on public.property_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
        from public.listings l
       where l.id = property_id
         and l.workflow_status = 'published'
    )
  );

-- Хувийн хүснэгтүүд: Supabase advisor-д policy байх (anon/authenticated-д select grant байхгүй)
drop policy if exists profiles_private on public.profiles;
create policy profiles_private
  on public.profiles
  for select
  to anon, authenticated
  using (false);

drop policy if exists saved_listings_private on public.saved_listings;
create policy saved_listings_private
  on public.saved_listings
  for select
  to anon, authenticated
  using (false);

drop policy if exists searching_agent_private on public.searching_agent;
create policy searching_agent_private
  on public.searching_agent
  for select
  to anon, authenticated
  using (false);

drop policy if exists agent_saling_private on public.agent_saling;
create policy agent_saling_private
  on public.agent_saling
  for select
  to anon, authenticated
  using (false);
