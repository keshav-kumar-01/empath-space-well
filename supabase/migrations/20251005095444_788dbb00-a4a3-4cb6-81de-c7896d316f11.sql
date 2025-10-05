-- Fix remaining security issues - proper order

-- 1. Drop policy that depends on the view
DROP POLICY IF EXISTS "Users can view public therapist info" ON public.therapists;

-- 2. Drop and recreate view without SECURITY DEFINER
DROP VIEW IF EXISTS public.therapists_public CASCADE;

CREATE VIEW public.therapists_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  bio,
  specialties,
  languages,
  experience,
  fee,
  rating,
  total_reviews,
  avatar_url,
  available,
  session_types,
  created_at,
  updated_at
FROM public.therapists
WHERE available = true;

-- Grant access to the view
GRANT SELECT ON public.therapists_public TO authenticated, anon;

-- 3. Recreate the policy
CREATE POLICY "Users can view public therapist info"
ON public.therapists
FOR SELECT
TO authenticated, anon
USING (
  available = true AND 
  id IN (SELECT id FROM public.therapists_public)
);

-- 4. Ensure all remaining functions have proper search_path
CREATE OR REPLACE FUNCTION public.update_therapist_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.therapists 
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.session_reviews 
      WHERE therapist_id = NEW.therapist_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.session_reviews 
      WHERE therapist_id = NEW.therapist_id
    )
  WHERE id = NEW.therapist_id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_psychologist_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.psychologists 
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.session_reviews 
      WHERE psychologist_id = NEW.psychologist_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.session_reviews 
      WHERE psychologist_id = NEW.psychologist_id
    )
  WHERE id = NEW.psychologist_id;
  
  RETURN NEW;
END;
$function$;