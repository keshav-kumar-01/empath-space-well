
-- Drop the existing restrictive policy for viewing appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;

-- Create a new policy that allows users to view their own appointments OR admins to view all appointments
CREATE POLICY "Users can view their own appointments or admins can view all" 
  ON public.appointments 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Also update the update policy to allow admins to update any appointment
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;

CREATE POLICY "Users can update their own appointments or admins can update any" 
  ON public.appointments 
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Update the delete policy to allow admins to delete any appointment
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;

CREATE POLICY "Users can delete their own appointments or admins can delete any" 
  ON public.appointments 
  FOR DELETE 
  USING (
    auth.uid() = user_id OR 
    has_role(auth.uid(), 'admin'::app_role)
  );
