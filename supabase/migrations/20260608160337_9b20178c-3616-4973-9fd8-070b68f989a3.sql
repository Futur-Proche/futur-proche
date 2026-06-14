ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS recap text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;