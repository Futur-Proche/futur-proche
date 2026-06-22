CREATE OR REPLACE FUNCTION public.get_my_event_registrations()
RETURNS TABLE(event_id uuid, statut text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT DISTINCT r.event_id, r.statut::text
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = auth.uid()
  WHERE auth.uid() IS NOT NULL
    AND r.statut <> 'cancelled'
    AND (
      r.user_id = auth.uid()
      OR (
        r.guest_email IS NOT NULL
        AND lower(r.guest_email) = lower(COALESCE(p.email, auth.jwt() ->> 'email'))
      )
    )
$$;

REVOKE ALL ON FUNCTION public.get_my_event_registrations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_event_registrations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_event_registrations() TO service_role;