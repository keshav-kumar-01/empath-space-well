
-- Create a storage bucket for therapist images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'therapist-images', 
  'therapist-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create RLS policy to allow admins to upload images
CREATE POLICY "Admins can upload therapist images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'therapist-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policy to allow admins to update images
CREATE POLICY "Admins can update therapist images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'therapist-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policy to allow admins to delete images
CREATE POLICY "Admins can delete therapist images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'therapist-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policy to allow everyone to view images (since bucket is public)
CREATE POLICY "Anyone can view therapist images" ON storage.objects
FOR SELECT USING (bucket_id = 'therapist-images');
