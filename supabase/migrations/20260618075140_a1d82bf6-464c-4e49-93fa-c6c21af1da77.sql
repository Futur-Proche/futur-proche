
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS registrations_closed boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.get_event_registrations_count(_event_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.event_registrations
  WHERE event_id = _event_id AND statut <> 'cancelled'
$$;

REVOKE ALL ON FUNCTION public.get_event_registrations_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_event_registrations_count(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_event_participants(_event_id uuid)
RETURNS TABLE(
  kind text,
  user_id uuid,
  prenom text,
  nom text,
  poste text,
  entreprise text,
  photo_url text,
  linkedin text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE WHEN r.user_id IS NOT NULL THEN 'member' ELSE 'guest' END::text AS kind,
    r.user_id,
    COALESCE(p.prenom, r.guest_prenom) AS prenom,
    COALESCE(p.nom, r.guest_nom) AS nom,
    p.poste,
    p.entreprise,
    p.photo_url,
    p.linkedin
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = _event_id AND r.statut <> 'cancelled'
  ORDER BY COALESCE(p.nom, r.guest_nom) NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_event_participants(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_event_participants(uuid) TO authenticated;
