
-- Update the RLS policy for therapists to allow admins to manage therapists
DROP POLICY IF EXISTS "Admins can manage therapists" ON public.therapists;

CREATE POLICY "Admins can manage therapists" ON public.therapists
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Also ensure the admin user has the proper role in user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('62529ac4-eaf2-4fa8-bca1-b6c0938478f1', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
