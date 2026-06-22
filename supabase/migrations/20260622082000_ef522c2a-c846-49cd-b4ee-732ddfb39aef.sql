CREATE OR REPLACE FUNCTION public.get_event_registrations_admin(_event_id uuid)
RETURNS TABLE (
  id uuid, user_id uuid, is_guest boolean, statut text,
  guest_email text, guest_prenom text, guest_nom text,
  guest_poste text, guest_entreprise text,
  stripe_session_id text, paid_at timestamptz, created_at timestamptz,
  prenom text, nom text, email text,
  poste text, entreprise text, photo_url text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
  SELECT r.id, r.user_id, r.is_guest, r.statut,
         r.guest_email, r.guest_prenom, r.guest_nom,
         r.guest_poste, r.guest_entreprise,
         r.stripe_session_id, r.paid_at, r.created_at,
         p.prenom, p.nom, p.email,
         p.poste, p.entreprise, p.photo_url
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = _event_id
  ORDER BY r.created_at ASC;
END; $$;