alter table public.candidatures
add column if not exists photo_url text,
add column if not exists photo_source text,
add column if not exists photo_fetched_at timestamp with time zone;