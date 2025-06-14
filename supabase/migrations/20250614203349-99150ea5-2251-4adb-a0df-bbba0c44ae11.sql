
-- Create therapists table to store psychologist information
CREATE TABLE public.therapists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT[] NOT NULL,
  experience TEXT NOT NULL,
  languages TEXT[] NOT NULL,
  fee TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  avatar_url TEXT,
  bio TEXT,
  session_types TEXT[] DEFAULT ARRAY['individual', 'couples', 'group', 'consultation'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table to store booking details
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id UUID REFERENCES public.therapists(id) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample therapists data
INSERT INTO public.therapists (name, specialties, experience, languages, fee, rating, total_reviews, available, bio) VALUES
('Dr. Priya Sharma', ARRAY['Anxiety', 'Depression', 'CBT'], '8+ years', ARRAY['Hindi', 'English'], '₹1,500', 4.9, 127, true, 'Specialized in cognitive behavioral therapy with extensive experience in treating anxiety and depression.'),
('Dr. Rajesh Kumar', ARRAY['Trauma', 'PTSD', 'Family Therapy'], '12+ years', ARRAY['Hindi', 'English', 'Punjabi'], '₹2,000', 4.8, 203, true, 'Expert in trauma therapy and family counseling with over a decade of experience.'),
('Dr. Meera Patel', ARRAY['Couples Therapy', 'Relationships'], '6+ years', ARRAY['Hindi', 'English', 'Gujarati'], '₹1,800', 4.7, 89, false, 'Focuses on relationship counseling and couples therapy with a compassionate approach.'),
('Dr. Arjun Singh', ARRAY['Addiction', 'Behavioral Therapy'], '10+ years', ARRAY['Hindi', 'English'], '₹1,700', 4.6, 156, true, 'Specializes in addiction recovery and behavioral modification therapies.'),
('Dr. Kavya Nair', ARRAY['Child Psychology', 'ADHD'], '7+ years', ARRAY['Hindi', 'English', 'Malayalam'], '₹1,600', 4.8, 98, true, 'Child psychologist with expertise in ADHD and developmental disorders.');

-- Enable Row Level Security on both tables
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for therapists (public read access)
CREATE POLICY "Anyone can view available therapists" 
  ON public.therapists 
  FOR SELECT 
  USING (available = true);

CREATE POLICY "Admins can manage therapists" 
  ON public.therapists 
  FOR ALL 
  USING (false); -- Only admins through service role

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (user_id = auth.uid());
