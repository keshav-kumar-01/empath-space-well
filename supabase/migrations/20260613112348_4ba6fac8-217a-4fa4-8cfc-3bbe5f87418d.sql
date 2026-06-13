
-- Revoke EXECUTE on trigger functions from all client roles (only the trigger system needs them)
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_security_audit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_psychologist_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_therapist_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_knowledge_updated_at() FROM PUBLIC, anon, authenticated;

-- Revoke EXECUTE from anon on definer helpers that are only meaningful for signed-in users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_therapist_by_user_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_therapist_id_by_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_therapist_user(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_is_in_room(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_safe_author_name(text, text, boolean) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_community_post_owner_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.match_knowledge_chunks(vector, integer, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_post_upvotes(uuid) FROM PUBLIC, anon;

-- Storage: prevent anonymous LISTING of therapist-images bucket while keeping public file URLs accessible
-- (public buckets serve files directly by URL without needing a SELECT policy)
DROP POLICY IF EXISTS "Anyone can view therapist images" ON storage.objects;
CREATE POLICY "Authenticated users can list therapist images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'therapist-images');
