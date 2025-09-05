-- Fix RLS policies that are trying to access auth.users table directly
-- This is causing "permission denied for table users" errors

-- Drop the problematic therapist policies that join with auth.users
DROP POLICY IF EXISTS "Therapists can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Therapists can update their appointments" ON public.appointments;

-- Create a security definer function to get therapist ID by user ID
CREATE OR REPLACE FUNCTION public.get_therapist_id_by_user(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id
  FROM public.therapists t
  INNER JOIN auth.users u ON t.email = u.email
  WHERE u.id = _user_id
  LIMIT 1;
$$;

-- Recreate therapist policies using the security definer function
CREATE POLICY "Therapists can view their appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated
USING (
  is_therapist_user(auth.uid()) AND 
  therapist_id = get_therapist_id_by_user(auth.uid())
);

CREATE POLICY "Therapists can update their appointments" 
ON public.appointments 
FOR UPDATE 
TO authenticated
USING (
  is_therapist_user(auth.uid()) AND 
  therapist_id = get_therapist_id_by_user(auth.uid())
);