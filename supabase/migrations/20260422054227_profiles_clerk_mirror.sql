comment on table public.profiles is 'Clerk-аас таньсан хэрэглэгч — нэг clerk_user_id = нэг мөр. API (POST /api/profile/sync) эсвэл бусад upsert-ээр бөглөнө.';

alter table public.profiles
  add column if not exists avatar_url text;

comment on column public.profiles.clerk_user_id is 'Clerk user id (user_...).';
comment on column public.profiles.avatar_url is 'Clerk profile image URL (optional).';

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();
