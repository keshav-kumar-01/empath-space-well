
-- Create wellness plans table
CREATE TABLE public.wellness_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('daily', 'weekly', 'monthly')),
  title TEXT NOT NULL,
  description TEXT,
  activities JSONB NOT NULL DEFAULT '[]',
  ai_generated BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voice therapy sessions table
CREATE TABLE public.voice_therapy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('anxiety', 'stress', 'depression', 'general')),
  duration INTEGER NOT NULL, -- in seconds
  transcript TEXT,
  ai_response TEXT,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dream analysis table
CREATE TABLE public.dream_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  dream_description TEXT NOT NULL,
  ai_interpretation TEXT,
  themes JSONB DEFAULT '[]',
  emotions JSONB DEFAULT '[]',
  symbols JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emotion recognition table
CREATE TABLE public.emotion_recognition (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT,
  detected_emotions JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  analysis_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mental health goals table
CREATE TABLE public.mental_health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('anxiety_reduction', 'mood_improvement', 'sleep_quality', 'stress_management', 'social_connection', 'mindfulness')),
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group therapy rooms table
CREATE TABLE public.group_therapy_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_name TEXT NOT NULL,
  description TEXT,
  therapy_type TEXT NOT NULL CHECK (therapy_type IN ('anxiety', 'depression', 'grief', 'addiction', 'general')),
  max_participants INTEGER DEFAULT 8,
  current_participants INTEGER DEFAULT 0,
  facilitator_id UUID REFERENCES auth.users,
  is_active BOOLEAN DEFAULT true,
  meeting_schedule TEXT, -- JSON string for recurring schedule
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group therapy participants table
CREATE TABLE public.group_therapy_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.group_therapy_rooms NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(room_id, user_id)
);

-- Create peer support matches table
CREATE TABLE public.peer_support_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users NOT NULL,
  user2_id UUID REFERENCES auth.users NOT NULL,
  match_score DECIMAL(3,2) NOT NULL,
  compatibility_factors JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'active', 'ended')),
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  CHECK (user1_id != user2_id)
);

-- Create mental health insights table
CREATE TABLE public.mental_health_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('mood_trend', 'activity_pattern', 'sleep_correlation', 'stress_trigger', 'progress_milestone')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data_points JSONB DEFAULT '{}',
  severity_level TEXT CHECK (severity_level IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.wellness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_therapy_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_therapy_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_support_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Wellness plans policies
CREATE POLICY "Users can view their own wellness plans" ON public.wellness_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own wellness plans" ON public.wellness_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wellness plans" ON public.wellness_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wellness plans" ON public.wellness_plans FOR DELETE USING (auth.uid() = user_id);

-- Voice therapy sessions policies
CREATE POLICY "Users can view their own voice sessions" ON public.voice_therapy_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own voice sessions" ON public.voice_therapy_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dream analysis policies
CREATE POLICY "Users can view their own dream analysis" ON public.dream_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own dream analysis" ON public.dream_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emotion recognition policies
CREATE POLICY "Users can view their own emotion analysis" ON public.emotion_recognition FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own emotion analysis" ON public.emotion_recognition FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mental health goals policies
CREATE POLICY "Users can view their own goals" ON public.mental_health_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.mental_health_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.mental_health_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.mental_health_goals FOR DELETE USING (auth.uid() = user_id);

-- Group therapy rooms policies (public read, admin create)
CREATE POLICY "Anyone can view active group therapy rooms" ON public.group_therapy_rooms FOR SELECT USING (is_active = true);

-- Group therapy participants policies
CREATE POLICY "Users can view participants of rooms they're in" ON public.group_therapy_participants FOR SELECT USING 
  (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.group_therapy_participants gtp WHERE gtp.room_id = group_therapy_participants.room_id AND gtp.user_id = auth.uid()));
CREATE POLICY "Users can join group therapy rooms" ON public.group_therapy_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave group therapy rooms" ON public.group_therapy_participants FOR UPDATE USING (auth.uid() = user_id);

-- Peer support matches policies
CREATE POLICY "Users can view their own matches" ON public.peer_support_matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can update their own matches" ON public.peer_support_matches FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Mental health insights policies
CREATE POLICY "Users can view their own insights" ON public.mental_health_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.mental_health_insights FOR UPDATE USING (auth.uid() = user_id);
