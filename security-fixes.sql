
-- Fix blog_posts RLS policy to require authentication
DROP POLICY IF EXISTS "Blog posts are publicly readable" ON public.blog_posts;
CREATE POLICY "Blog posts are readable by authenticated users" 
ON public.blog_posts 
FOR SELECT 
TO authenticated
USING (published = true OR auth.uid() = user_id);

-- Fix community_posts RLS policy to require authentication  
DROP POLICY IF EXISTS "Community posts are publicly readable" ON public.community_posts;
CREATE POLICY "Community posts are readable by authenticated users"
ON public.community_posts
FOR SELECT
TO authenticated
USING (true);

-- Fix post_comments RLS policy to require authentication
DROP POLICY IF EXISTS "Comments are publicly readable" ON public.post_comments;
CREATE POLICY "Comments are readable by authenticated users"
ON public.post_comments
FOR SELECT
TO authenticated
USING (true);

-- Fix feedback RLS policy so users only see their own feedback
DROP POLICY IF EXISTS "Feedback is readable by all authenticated users" ON public.feedback;
CREATE POLICY "Users can only read their own feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix user_roles RLS policy to prevent self-promotion to admin
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Ensure user_id fields are not nullable where they should be required
-- Note: These ALTER TABLE commands should be run carefully in production
-- ALTER TABLE public.feedback ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE public.psychological_test_results ALTER COLUMN user_id SET NOT NULL;
