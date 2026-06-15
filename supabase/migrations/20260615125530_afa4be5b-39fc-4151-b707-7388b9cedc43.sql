
CREATE OR REPLACE FUNCTION public.link_registration_to_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_id uuid;
BEGIN
  IF NEW.user_id IS NULL AND NEW.guest_email IS NOT NULL THEN
    SELECT id INTO matched_id FROM public.profiles
    WHERE lower(email) = lower(NEW.guest_email) LIMIT 1;
    IF matched_id IS NOT NULL THEN
      NEW.user_id := matched_id;
      NEW.is_guest := false;
      NEW.guest_email := NULL;
      NEW.guest_prenom := NULL;
      NEW.guest_nom := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS link_registration_to_profile_trg ON public.event_registrations;
CREATE TRIGGER link_registration_to_profile_trg
  BEFORE INSERT ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.link_registration_to_profile();

-- Backfill
UPDATE public.event_registrations er
SET user_id = p.id,
    is_guest = false,
    guest_email = NULL,
    guest_prenom = NULL,
    guest_nom = NULL
FROM public.profiles p
WHERE er.user_id IS NULL
  AND er.guest_email IS NOT NULL
  AND lower(er.guest_email) = lower(p.email);
