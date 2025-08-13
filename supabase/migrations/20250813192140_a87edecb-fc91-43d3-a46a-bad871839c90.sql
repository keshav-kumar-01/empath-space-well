
-- First, let's create a security definer function to check if a user is in a room
CREATE OR REPLACE FUNCTION public.user_is_in_room(room_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.group_therapy_participants 
    WHERE room_id = room_id_param 
      AND user_id = user_id_param 
      AND is_active = true
  );
$$;

-- Now let's drop and recreate the problematic policy
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON public.group_therapy_participants;

CREATE POLICY "Users can view participants in their rooms" 
ON public.group_therapy_participants 
FOR SELECT 
USING (
  public.user_is_in_room(group_therapy_participants.room_id, auth.uid()) 
  OR auth.uid() = user_id
);
