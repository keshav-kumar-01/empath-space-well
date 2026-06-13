
-- Revoke anon SELECT on all private tables (RLS already blocks rows; this also hides them from GraphQL introspection)
REVOKE SELECT ON public.appointments FROM anon;
REVOKE SELECT ON public.blog_posts FROM anon;
REVOKE SELECT ON public.community_posts FROM anon;
REVOKE SELECT ON public.conversations FROM anon;
REVOKE SELECT ON public.dream_analysis FROM anon;
REVOKE SELECT ON public.emotion_recognition FROM anon;
REVOKE SELECT ON public.feedback FROM anon;
REVOKE SELECT ON public.group_therapy_participants FROM anon;
REVOKE SELECT ON public.group_therapy_rooms FROM anon;
REVOKE SELECT ON public.journal_entries FROM anon;
REVOKE SELECT ON public.knowledge_chunks FROM anon;
REVOKE SELECT ON public.knowledge_documents FROM anon;
REVOKE SELECT ON public.mental_health_goals FROM anon;
REVOKE SELECT ON public.mental_health_insights FROM anon;
REVOKE SELECT ON public.mood_entries FROM anon;
REVOKE SELECT ON public.peer_support_matches FROM anon;
REVOKE SELECT ON public.post_comments FROM anon;
REVOKE SELECT ON public.psychological_test_results FROM anon;
REVOKE SELECT ON public.quiz_results FROM anon;
REVOKE SELECT ON public.rate_limits FROM anon;
REVOKE SELECT ON public.security_audit_log FROM anon;
REVOKE SELECT ON public.session_reviews FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;
REVOKE SELECT ON public.voice_therapy_sessions FROM anon;
REVOKE SELECT ON public.wellness_plans FROM anon;

-- Revoke authenticated SELECT on internal-only tables (only accessed via service role / RPCs)
REVOKE SELECT ON public.knowledge_chunks FROM authenticated;
REVOKE SELECT ON public.knowledge_documents FROM authenticated;
REVOKE SELECT ON public.security_audit_log FROM authenticated;
REVOKE SELECT ON public.rate_limits FROM authenticated;
