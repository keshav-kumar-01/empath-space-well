
-- This SQL function should be executed in your Supabase project
-- You can copy this and run it in the SQL editor in the Supabase dashboard
CREATE OR REPLACE FUNCTION public.submit_feedback(
  p_user_id UUID,
  p_rating INTEGER,
  p_comment TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.feedback (user_id, rating, comment)
  VALUES (p_user_id, p_rating, p_comment);
END;
$$ LANGUAGE plpgsql;
