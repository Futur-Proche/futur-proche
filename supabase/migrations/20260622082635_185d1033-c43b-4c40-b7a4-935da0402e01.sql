CREATE OR REPLACE FUNCTION public.get_event_registrations_admin(_event_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  is_guest boolean,
  statut text,
  guest_email text,
  guest_prenom text,
  guest_nom text,
  guest_poste text,
  guest_entreprise text,
  stripe_session_id text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone,
  prenom text,
  nom text,
  email text,
  poste text,
  entreprise text,
  photo_url text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  RETURN QUERY
  SELECT
    r.id,
    r.user_id,
    r.is_guest,
    r.statut::text,
    r.guest_email,
    r.guest_prenom,
    r.guest_nom,
    r.guest_poste,
    r.guest_entreprise,
    r.stripe_session_id,
    r.paid_at,
    r.created_at,
    p.prenom,
    p.nom,
    p.email,
    p.poste,
    p.entreprise,
    p.photo_url
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = _event_id
  ORDER BY r.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_event_registrations_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_event_registrations_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_event_registrations_admin(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.is_registered_to_event(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN _user_id IS NULL THEN false
    WHEN auth.uid() = _user_id OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN EXISTS (
      SELECT 1
      FROM public.event_registrations
      WHERE event_id = _event_id
        AND user_id = _user_id
        AND statut <> 'cancelled'
    )
    ELSE false
  END
$$;

REVOKE ALL ON FUNCTION public.is_registered_to_event(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO service_role;