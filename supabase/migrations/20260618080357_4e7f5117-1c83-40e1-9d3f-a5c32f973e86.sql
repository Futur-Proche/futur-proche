
ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS guest_poste text,
  ADD COLUMN IF NOT EXISTS guest_entreprise text;

CREATE OR REPLACE FUNCTION public.get_event_participants(_event_id uuid)
RETURNS TABLE(kind text, user_id uuid, prenom text, nom text, poste text, entreprise text, photo_url text, linkedin text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    CASE WHEN r.user_id IS NOT NULL THEN 'member' ELSE 'guest' END::text AS kind,
    r.user_id,
    COALESCE(p.prenom, r.guest_prenom) AS prenom,
    COALESCE(p.nom, r.guest_nom) AS nom,
    COALESCE(p.poste, r.guest_poste) AS poste,
    COALESCE(p.entreprise, r.guest_entreprise) AS entreprise,
    p.photo_url,
    p.linkedin
  FROM public.event_registrations r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.event_id = _event_id AND r.statut <> 'cancelled'
  ORDER BY COALESCE(p.nom, r.guest_nom) NULLS LAST;
$function$;

-- Update the link trigger to preserve poste/entreprise when linking
CREATE OR REPLACE FUNCTION public.link_registration_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      NEW.guest_poste := NULL;
      NEW.guest_entreprise := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_link_registration_to_profile ON public.event_registrations;
CREATE TRIGGER trg_link_registration_to_profile
BEFORE INSERT ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION public.link_registration_to_profile();
