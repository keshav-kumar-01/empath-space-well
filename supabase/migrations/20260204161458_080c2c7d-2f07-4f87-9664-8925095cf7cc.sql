-- Create a function to increment upvotes that bypasses RLS
CREATE OR REPLACE FUNCTION public.increment_post_upvotes(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts 
  SET upvotes = upvotes + 1
  WHERE id = post_id
  AND is_approved = true
  AND (is_flagged = false OR flag_count < 3);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_post_upvotes(uuid) TO authenticated;