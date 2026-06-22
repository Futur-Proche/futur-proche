REVOKE EXECUTE ON FUNCTION public.get_event_registrations_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_my_event_registrations() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION public.get_event_registrations_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_event_registrations_admin(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_my_event_registrations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_event_registrations() TO service_role;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO service_role;