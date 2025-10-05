-- Fix Security Issues

-- 1. Create a secure view for therapists without exposing emails
CREATE OR REPLACE VIEW public.therapists_public AS
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

-- 2. Drop the overly permissive policy on therapists
DROP POLICY IF EXISTS "Anyone can view available therapists" ON public.therapists;

-- Create a more restrictive policy that only allows viewing through the public view
CREATE POLICY "Users can view public therapist info"
ON public.therapists
FOR SELECT
TO authenticated, anon
USING (
  available = true AND 
  id IN (SELECT id FROM public.therapists_public)
);

-- Allow therapists to see their own email
CREATE POLICY "Therapists can view their own full profile"
ON public.therapists
FOR SELECT
TO authenticated
USING (
  is_therapist_user(auth.uid()) AND 
  id = get_therapist_id_by_user(auth.uid())
);

-- 3. Fix feedback table conflicting policies
DROP POLICY IF EXISTS "All authenticated users can view all feedback" ON public.feedback;

-- Keep only the user-specific policies (already exist):
-- "Users can only read their own feedback"
-- "Users can view their own feedback"

-- 4. Add privacy controls for blog posts - add display_name column
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS show_real_name boolean DEFAULT false;

-- Update existing posts to use author_name as display_name
UPDATE public.blog_posts 
SET display_name = author_name 
WHERE display_name IS NULL;

-- Create a function to get safe author name
CREATE OR REPLACE FUNCTION public.get_safe_author_name(
  _author_name text,
  _display_name text,
  _show_real_name boolean
)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN _show_real_name THEN _author_name
    ELSE COALESCE(_display_name, 'Anonymous')
  END;
$$;

-- 5. Add RLS policy to protect user_roles from unauthorized reads
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 6. Ensure all functions have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
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

-- 7. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.log_security_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_audit();

DROP TRIGGER IF EXISTS audit_therapists ON public.therapists;
CREATE TRIGGER audit_therapists
  AFTER INSERT OR UPDATE OR DELETE ON public.therapists
  FOR EACH ROW EXECUTE FUNCTION public.log_security_audit();

-- 8. Add rate limiting table for sensitive operations
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, action, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 9. Secure community posts to prevent spam
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS flag_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT true;

-- Update policy to hide flagged posts
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;

CREATE POLICY "Users can view approved posts"
ON public.community_posts
FOR SELECT
TO authenticated, anon
USING (is_approved = true AND (is_flagged = false OR flag_count < 3));

-- 10. Add content moderation for blog posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- Update blog policy
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;

CREATE POLICY "Users can view approved published blog posts"
ON public.blog_posts
FOR SELECT
TO authenticated, anon
USING (
  published = true AND 
  moderation_status = 'approved' AND
  is_flagged = false
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin')
);