-- Fix security definer view issue by using SECURITY INVOKER (default, safe)
-- and creating a proper RLS-based approach instead

-- Drop the view that was created with implicit security definer
DROP VIEW IF EXISTS public.community_posts_public;

-- Create a function to safely get community posts with hidden user_id for non-owners
CREATE OR REPLACE FUNCTION public.get_community_post_owner_id(_post_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() = _post_user_id THEN _post_user_id 
    ELSE NULL 
  END;
$$;

-- Create the view with explicit SECURITY INVOKER (uses caller's permissions)
CREATE VIEW public.community_posts_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  title,
  content,
  category,
  mood,
  upvotes,
  created_at,
  updated_at,
  public.get_community_post_owner_id(user_id) as user_id,
  (auth.uid() = user_id) as is_owner
FROM public.community_posts
WHERE is_approved = true AND (is_flagged = false OR flag_count < 3);

-- Grant access to the view
GRANT SELECT ON public.community_posts_public TO authenticated;
GRANT SELECT ON public.community_posts_public TO anon;