-- Fix the user_is_in_room function that's missing search_path
CREATE OR REPLACE FUNCTION public.user_is_in_room(room_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_therapy_participants 
    WHERE room_id = room_id_param 
      AND user_id = user_id_param 
      AND is_active = true
  );
$$;