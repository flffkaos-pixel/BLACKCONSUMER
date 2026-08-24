-- Supabase Dashboard > SQL Editor에서 실행하세요.
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  gender text not null default '기타/모름',
  age_group text,
  height text,
  build text not null default '보통',
  appearance text,
  contact_info text,
  vehicle_number text,
  incident_at timestamptz,
  location text,
  damage_type text,
  damage_amount integer,
  description text not null,
  response_process text,
  evidence_type text,
  media_url text
);

alter table reports enable row level security;

create policy "공개 조회" on reports for select using (true);
create policy "누구나 제보 등록" on reports for insert with check (true);

-- 조회수
alter table reports add column if not exists views integer not null default 0;

create or replace function increment_views(report_id uuid)
returns void language sql as $$
  update reports set views = views + 1 where id = report_id;
$$;

-- 허위 제보 신고
create table if not exists report_flags (
  id bigint generated always as identity primary key,
  report_id uuid references reports(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table report_flags enable row level security;
create policy "누구나 신고 접수" on report_flags for insert with check (true);

-- 증거 파일 업로드용 버킷 (public)
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

create policy "증거 공개 읽기" on storage.objects for select using (bucket_id = 'evidence');
create policy "증거 업로드 허용" on storage.objects for insert with check (bucket_id = 'evidence');
