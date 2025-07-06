
-- Fix leaked password protection by enabling it
-- This needs to be done in Supabase Auth settings, but we can also set search_path for functions

-- Fix Function Search Path Mutable issues by setting search_path to empty string
-- This prevents potential SQL injection attacks through search_path manipulation

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'moderator' THEN 2
      WHEN 'user' THEN 3
    END
  LIMIT 1
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Update handle_new_user_role function
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Check if the user's email is the admin email and insert role if not exists
  IF NEW.email = 'keshavkumarhf@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update update_therapist_rating function
CREATE OR REPLACE FUNCTION public.update_therapist_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
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

-- Update update_psychologist_rating function
CREATE OR REPLACE FUNCTION public.update_psychologist_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
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
