-- Гадаад эх сурвалжийн мэдээний холбоосууд (`/news` хуудас).
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  href text not null,
  source text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists news_sort_created_idx
  on public.news (sort_order asc, created_at asc);

comment on table public.news is 'Мэдээний холбоосын жагсаалт — вэбийн /news хуудас уншина.';

alter table public.news enable row level security;

drop policy if exists news_public_read on public.news;
create policy news_public_read
  on public.news
  for select
  to anon, authenticated
  using (is_active);

grant select on table public.news to anon, authenticated;

insert into public.news (title, description, href, source, sort_order)
values
  (
    'News.mn дээрх сүүлийн үеийн мэдээнүүд',
    'Ерөнхий мэдээ, эдийн засаг, үл хөдлөхийн холбоотой нийтлэлүүдийг эндээс үзээрэй.',
    'https://news.mn/',
    'News.mn',
    0
  ),
  (
    'SAK.mn дээрх сүүлийн үеийн мэдээнүүд',
    'Үл хөдлөх хөрөнгө, зах зээл, санхүүтэй холбоотой хамгийн сүүлийн үеийн мэдээ мэдээлэл.',
    'https://sak.mn/',
    'SAK.mn',
    1
  ),
  (
    'News.mn дээрх сүүлийн үеийн мэдээнүд',
    'Ерөнхий мэдээ, эдийн засаг, үл хөдлөхийн холбоотой нийтлэлүүдийг эндээс үзээрэй.',
    'https://news.mn/',
    'News.mn',
    2
  ),
  (
    'Ikon.mn эдийн засгийн булан',
    'Зах зээлийн хөдөлгөөн, санхүү, барилгын салбарын мэдээллийг унших холбоос.',
    'https://ikon.mn/l/2',
    'Ikon.mn',
    3
  ),
  (
    'Unread Today бизнесийн тойм',
    'Тренд, бизнес, хөрөнгө оруулалтын агуулгатай нийтлэлүүдийн хуудас.',
    'https://unread.today/',
    'Unread Today',
    4
  ),
  (
    'Montsame эдийн засгийн мэдээ',
    'Албан эх сурвалжийн эдийн засаг, бүтээн байгуулалтын мэдээллийг харах холбоос.',
    'https://montsame.mn/mn/economy',
    'Montsame',
    5
  );
