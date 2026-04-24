-- Зарын утсыг хүснэгтэд шууд хадгалж, засах форм болон тайланг хөнгөвчлөнө.
-- `submitted_by` JSON-тай хамт синк хийнэ (API PATCH/POST).

alter table public.listings
  add column if not exists contact_phone text;

comment on column public.listings.contact_phone is
  'Зар дээрх холбоо барих дугаар (submitted_by.phone-тай ижил утгаар синк).';

update public.listings
set contact_phone = nullif(trim(submitted_by->>'phone'), '')
where (contact_phone is null or trim(contact_phone) = '')
  and submitted_by is not null
  and coalesce(trim(submitted_by->>'phone'), '') <> '';
