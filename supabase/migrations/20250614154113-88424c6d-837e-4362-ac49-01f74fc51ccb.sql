
-- Create therapists/psychologists table
CREATE TABLE public.therapists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  license_number TEXT,
  license_type TEXT,
  bio TEXT,
  availability JSONB DEFAULT '{}',
  calendly_link TEXT,
  jitsi_room_id TEXT,
  contact_email TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapy sessions table
CREATE TABLE public.therapy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  therapist_id UUID REFERENCES public.therapists(id) NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  jitsi_room_id TEXT,
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session reviews table
CREATE TABLE public.session_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.therapy_sessions(id) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  therapist_id UUID REFERENCES public.therapists(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency resources table
CREATE TABLE public.emergency_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phone_number TEXT,
  website_url TEXT,
  country TEXT DEFAULT 'global',
  resource_type TEXT NOT NULL CHECK (resource_type IN ('hotline', 'website', 'app', 'text_service')),
  is_24_7 BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapists (public read access)
CREATE POLICY "Anyone can view verified therapists" 
  ON public.therapists 
  FOR SELECT 
  USING (is_verified = true AND is_available = true);

-- RLS Policies for therapy sessions (users can only see their own sessions)
CREATE POLICY "Users can view their own sessions" 
  ON public.therapy_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON public.therapy_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.therapy_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for session reviews (users can only manage their own reviews)
CREATE POLICY "Users can view session reviews" 
  ON public.session_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reviews" 
  ON public.session_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.session_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for emergency resources (public read access)
CREATE POLICY "Anyone can view emergency resources" 
  ON public.emergency_resources 
  FOR SELECT 
  USING (true);

-- Create function to update therapist ratings
CREATE OR REPLACE FUNCTION public.update_therapist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.therapists 
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.session_reviews 
      WHERE therapist_id = NEW.therapist_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.session_reviews 
      WHERE therapist_id = NEW.therapist_id
    )
  WHERE id = NEW.therapist_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update therapist ratings
CREATE TRIGGER update_therapist_rating_trigger
  AFTER INSERT OR UPDATE ON public.session_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_therapist_rating();

-- Insert some sample emergency resources
INSERT INTO public.emergency_resources (title, description, phone_number, website_url, country, resource_type, is_24_7) VALUES
('National Suicide Prevention Lifeline', 'Free and confidential emotional support to people in suicidal crisis or emotional distress', '988', 'https://suicidepreventionlifeline.org/', 'US', 'hotline', true),
('Crisis Text Line', 'Free crisis support via text message', '741741', 'https://www.crisistextline.org/', 'US', 'text_service', true),
('SAMHSA National Helpline', 'Free, confidential, 24/7 treatment referral service', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', 'US', 'hotline', true),
('International Association for Suicide Prevention', 'Global directory of crisis centers', '', 'https://www.iasp.info/resources/Crisis_Centres/', 'global', 'website', false);
