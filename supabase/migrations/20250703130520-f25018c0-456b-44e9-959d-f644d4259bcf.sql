
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view participants of rooms they're in" ON public.group_therapy_participants;

-- Create a simpler policy for viewing participants
CREATE POLICY "Users can view participants in their rooms" 
ON public.group_therapy_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_therapy_participants gtp 
    WHERE gtp.user_id = auth.uid() 
    AND gtp.room_id = group_therapy_participants.room_id 
    AND gtp.is_active = true
  ) 
  OR auth.uid() = user_id
);

-- Also allow admins to manage group therapy rooms
CREATE POLICY "Admins can manage group therapy rooms" 
ON public.group_therapy_rooms 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to manage participants
CREATE POLICY "Admins can manage participants" 
ON public.group_therapy_participants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));
