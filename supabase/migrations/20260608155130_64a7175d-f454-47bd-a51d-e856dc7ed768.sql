
REVOKE EXECUTE ON FUNCTION public.is_member(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_member(text) TO service_role;

-- is_registered_to_event is used inside RLS USING clauses (runs as definer) so
-- it does not need a direct GRANT; revoke from clients.
REVOKE EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_registered_to_event(uuid, uuid) TO service_role;
