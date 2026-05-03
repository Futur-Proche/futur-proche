
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'member');
CREATE TYPE public.candidature_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.event_format AS ENUM ('after_proche', 'diner', 'workshop', 'autre');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'past');
CREATE TYPE public.registration_status AS ENUM ('registered', 'paid', 'cancelled');
CREATE TYPE public.resource_type AS ENUM ('etude', 'synthese', 'podcast', 'newsletter', 'autre');
CREATE TYPE public.resource_access AS ENUM ('public', 'members');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  poste TEXT,
  entreprise TEXT,
  secteur TEXT,
  email TEXT NOT NULL,
  telephone TEXT,
  linkedin TEXT,
  photo_url TEXT,
  bio TEXT,
  ville TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Candidatures table
CREATE TABLE public.candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  poste TEXT NOT NULL,
  entreprise TEXT,
  secteur TEXT,
  email TEXT NOT NULL,
  telephone TEXT,
  linkedin TEXT,
  cooptation TEXT,
  statut candidature_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  format event_format NOT NULL DEFAULT 'after_proche',
  date DATE NOT NULL,
  heure TIME,
  ville TEXT,
  lieu TEXT,
  capacite INTEGER,
  prix NUMERIC(10,2),
  image_url TEXT,
  statut event_status NOT NULL DEFAULT 'draft',
  speakers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statut registration_status NOT NULL DEFAULT 'registered',
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  type resource_type NOT NULL DEFAULT 'autre',
  url TEXT,
  file_url TEXT,
  access resource_access NOT NULL DEFAULT 'public',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Authenticated users can view approved profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR id = auth.uid());

CREATE POLICY "Public can view profiles for homepage"
  ON public.profiles FOR SELECT TO anon
  USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for candidatures
CREATE POLICY "Anyone can submit candidature"
  ON public.candidatures FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all candidatures"
  ON public.candidatures FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update candidatures"
  ON public.candidatures FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Anyone can view published or past events"
  ON public.events FOR SELECT TO anon, authenticated
  USING (statut IN ('published', 'past'));

CREATE POLICY "Admins can manage all events"
  ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for event_registrations
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations"
  ON public.event_registrations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can register"
  ON public.event_registrations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own registration"
  ON public.event_registrations FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for resources
CREATE POLICY "Anyone can view public resources"
  ON public.resources FOR SELECT TO anon, authenticated
  USING (access = 'public');

CREATE POLICY "Members can view member resources"
  ON public.resources FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can manage resources"
  ON public.resources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', false);

-- Storage RLS
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can view event images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-images');

CREATE POLICY "Admins can update event images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated can view resources files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resources"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resources');

-- Trigger for updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
