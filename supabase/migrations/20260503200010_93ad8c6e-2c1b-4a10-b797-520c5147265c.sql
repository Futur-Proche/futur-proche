
-- Fix: Revoke anon execution on has_role
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon;

-- Fix: Set search_path on update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
