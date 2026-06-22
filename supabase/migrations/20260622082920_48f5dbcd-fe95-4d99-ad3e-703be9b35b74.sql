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
      FROM public.event_registrations r
      LEFT JOIN public.profiles p ON p.id = _user_id
      WHERE r.event_id = _event_id
        AND r.statut <> 'cancelled'
        AND (
          r.user_id = _user_id
          OR (
            r.guest_email IS NOT NULL
            AND lower(r.guest_email) = lower(COALESCE(p.email, auth.jwt() ->> 'email'))
          )
        )
    )
    ELSE false
  END
$$;

REVOKE ALL ON FUNCTION public.is_registered_to_event(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO service_role;