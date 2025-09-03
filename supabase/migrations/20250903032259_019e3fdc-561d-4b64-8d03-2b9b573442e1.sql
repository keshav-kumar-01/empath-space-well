-- Fix search path for security
DROP FUNCTION IF EXISTS public.is_therapist_user(_user_id UUID);
DROP FUNCTION IF EXISTS public.get_therapist_by_user_id(_user_id UUID);

-- Recreate functions with fixed search path
CREATE OR REPLACE FUNCTION public.is_therapist_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.therapists t
    INNER JOIN auth.users u ON t.email = u.email
    WHERE u.id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_therapist_by_user_id(_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  bio TEXT,
  specialties TEXT[],
  languages TEXT[],
  experience TEXT,
  fee TEXT,
  rating NUMERIC,
  total_reviews INTEGER,
  avatar_url TEXT,
  available BOOLEAN
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    t.id,
    t.name,
    t.email,
    t.bio,
    t.specialties,
    t.languages,
    t.experience,
    t.fee,
    t.rating,
    t.total_reviews,
    t.avatar_url,
    t.available
  FROM public.therapists t
  INNER JOIN auth.users u ON t.email = u.email
  WHERE u.id = _user_id;
$$;