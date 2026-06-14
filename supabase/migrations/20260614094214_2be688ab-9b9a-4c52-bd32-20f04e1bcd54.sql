CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contenu text,
  ADD COLUMN IF NOT EXISTS extrait text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS auteur text,
  ADD COLUMN IF NOT EXISTS temps_lecture int;

UPDATE public.resources
SET slug = lower(regexp_replace(regexp_replace(unaccent(titre), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) || '-' || substr(id::text, 1, 6)
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS resources_slug_key ON public.resources(slug);

DROP POLICY IF EXISTS "Public can view published resources" ON public.resources;
DROP POLICY IF EXISTS "Anyone can view published resources" ON public.resources;
DROP POLICY IF EXISTS "Anon can view published public resources" ON public.resources;
DROP POLICY IF EXISTS "Authenticated can view all published resources" ON public.resources;

CREATE POLICY "Anon can view published public resources"
  ON public.resources FOR SELECT TO anon
  USING (published_at IS NOT NULL AND is_public = true);

CREATE POLICY "Authenticated can view all published resources"
  ON public.resources FOR SELECT TO authenticated
  USING (published_at IS NOT NULL);

GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;