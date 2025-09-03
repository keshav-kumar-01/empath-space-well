-- Add email field to therapists table to link them with auth users
ALTER TABLE therapists ADD COLUMN email TEXT UNIQUE;

-- Add authentication check function for therapists
CREATE OR REPLACE FUNCTION public.is_therapist_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM therapists t
    INNER JOIN auth.users u ON t.email = u.email
    WHERE u.id = _user_id
  );
$$;

-- Add function to get therapist details by user ID
CREATE OR REPLACE FUNCTION public.get_therapist_by_user_id(_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  bio TEXT,
  specialties TEXT[],
  languages TEXT[],
  experience TEXT,
  fee TEXT,
  rating NUMERIC,
  total_reviews INTEGER,
  avatar_url TEXT,
  available BOOLEAN
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.id,
    t.name,
    t.email,
    t.bio,
    t.specialties,
    t.languages,
    t.experience,
    t.fee,
    t.rating,
    t.total_reviews,
    t.avatar_url,
    t.available
  FROM therapists t
  INNER JOIN auth.users u ON t.email = u.email
  WHERE u.id = _user_id;
$$;

-- Create session_reviews table to store therapist reviews
CREATE TABLE IF NOT EXISTS session_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on session_reviews
ALTER TABLE session_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for session_reviews
CREATE POLICY "Users can create reviews for their appointments" 
ON session_reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reviews" 
ON session_reviews FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view their reviews" 
ON session_reviews FOR SELECT 
USING (is_therapist_user(auth.uid()) AND therapist_id IN (
  SELECT t.id FROM therapists t 
  INNER JOIN auth.users u ON t.email = u.email 
  WHERE u.id = auth.uid()
));

-- Update appointments table to add therapist access
CREATE POLICY "Therapists can view their appointments" 
ON appointments FOR SELECT 
USING (
  is_therapist_user(auth.uid()) AND 
  therapist_id IN (
    SELECT t.id FROM therapists t 
    INNER JOIN auth.users u ON t.email = u.email 
    WHERE u.id = auth.uid()
  )
);

CREATE POLICY "Therapists can update their appointments" 
ON appointments FOR UPDATE 
USING (
  is_therapist_user(auth.uid()) AND 
  therapist_id IN (
    SELECT t.id FROM therapists t 
    INNER JOIN auth.users u ON t.email = u.email 
    WHERE u.id = auth.uid()
  )
);

-- Allow therapists to update their own profile
CREATE POLICY "Therapists can update their own profile" 
ON therapists FOR UPDATE 
USING (
  is_therapist_user(auth.uid()) AND 
  therapists.id IN (
    SELECT t.id FROM therapists t 
    INNER JOIN auth.users u ON t.email = u.email 
    WHERE u.id = auth.uid()
  )
);