
-- 1. Add is_open_to_all flag to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_open_to_all boolean NOT NULL DEFAULT false;

-- 2. Extend event_registrations to support guests + payment tracking
ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS guest_email text,
  ADD COLUMN IF NOT EXISTS guest_nom text,
  ADD COLUMN IF NOT EXISTS guest_prenom text,
  ADD COLUMN IF NOT EXISTS is_guest boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS amount_paid numeric,
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Allow user_id to be nullable for guest registrations
ALTER TABLE public.event_registrations ALTER COLUMN user_id DROP NOT NULL;

-- Validation: either user_id or guest_email must be set, consistently with is_guest
ALTER TABLE public.event_registrations DROP CONSTRAINT IF EXISTS event_registrations_actor_check;
ALTER TABLE public.event_registrations ADD CONSTRAINT event_registrations_actor_check
  CHECK ((is_guest = false AND user_id IS NOT NULL) OR (is_guest = true AND guest_email IS NOT NULL));

-- Unique partial indexes to prevent dupes
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_user_uniq
  ON public.event_registrations(event_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_guest_uniq
  ON public.event_registrations(event_id, lower(guest_email)) WHERE guest_email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_stripe_session_uniq
  ON public.event_registrations(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- 3. is_member helper (email recognized as member if has profile OR approved candidature)
CREATE OR REPLACE FUNCTION public.is_member(_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE lower(email) = lower(_email)
    UNION
    SELECT 1 FROM public.candidatures WHERE lower(email) = lower(_email) AND statut = 'approved'
  )
$$;

-- 4. RLS policies for event_registrations: allow members to see fellow participants
--    of events they themselves are registered to.
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can insert their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can update their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins manage all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Members see co-participants" ON public.event_registrations;

-- Helper: is the current user registered to a given event?
CREATE OR REPLACE FUNCTION public.is_registered_to_event(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.event_registrations
    WHERE event_id = _event_id AND user_id = _user_id AND statut <> 'cancelled'
  )
$$;

CREATE POLICY "Members see co-participants"
ON public.event_registrations FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_registered_to_event(event_id, auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- Inserts/updates restricted to service_role (edge functions). No client policy.
CREATE POLICY "Admins manage all registrations"
ON public.event_registrations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ensure grants still in place
GRANT SELECT ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
