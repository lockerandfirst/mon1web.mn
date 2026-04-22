alter table public.listings
  add column if not exists view_count integer not null default 0;

comment on column public.listings.view_count is 'Detail page impressions (increment via API).';
