-- Fix infinite recursion and security issues in therapists table

-- Drop problematic policies causing infinite recursion
DROP POLICY IF EXISTS "Users can view public therapist info" ON public.therapists;
DROP POLICY IF EXISTS "Therapists can view their own full profile" ON public.therapists;
DROP POLICY IF EXISTS "Therapists can update their own profile" ON public.therapists;

-- Recreate policies without recursion using security definer functions

-- Public users should ONLY use the therapists_public view (which excludes email)
-- No direct SELECT policy for anonymous users on main table

-- Therapists can view their own full profile using the security definer function
CREATE POLICY "Therapists can view own profile"
ON public.therapists
FOR SELECT
TO authenticated
USING (
  public.is_therapist_user(auth.uid()) 
  AND id = public.get_therapist_id_by_user(auth.uid())
);

-- Therapists can update their own profile using the security definer function
CREATE POLICY "Therapists can update own profile"
ON public.therapists
FOR UPDATE
TO authenticated
USING (
  public.is_therapist_user(auth.uid()) 
  AND id = public.get_therapist_id_by_user(auth.uid())
)
WITH CHECK (
  public.is_therapist_user(auth.uid()) 
  AND id = public.get_therapist_id_by_user(auth.uid())
);

-- Create a secure view for community posts that hides user_id from non-owners
DROP VIEW IF EXISTS public.community_posts_public;
CREATE VIEW public.community_posts_public AS
SELECT 
  id,
  title,
  content,
  category,
  mood,
  upvotes,
  created_at,
  updated_at,
  CASE 
    WHEN auth.uid() = user_id THEN user_id 
    ELSE NULL 
  END as user_id,
  CASE 
    WHEN auth.uid() = user_id THEN true 
    ELSE false 
  END as is_owner
FROM public.community_posts
WHERE is_approved = true AND (is_flagged = false OR flag_count < 3);

-- Grant access to the view
GRANT SELECT ON public.community_posts_public TO authenticated;
GRANT SELECT ON public.community_posts_public TO anon;