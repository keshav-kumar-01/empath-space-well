
-- Create subscription plans table to store plan details
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  monthly_price INTEGER NOT NULL, -- Price in paise (₹499 = 49900 paise)
  annual_price INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_conversations_limit INTEGER, -- NULL means unlimited
  professional_sessions_limit INTEGER NOT NULL DEFAULT 0,
  has_voice_therapy BOOLEAN NOT NULL DEFAULT false,
  has_community_access BOOLEAN NOT NULL DEFAULT false,
  community_read_only BOOLEAN NOT NULL DEFAULT true,
  has_priority_support BOOLEAN NOT NULL DEFAULT false,
  has_crisis_support BOOLEAN NOT NULL DEFAULT false,
  has_phone_support BOOLEAN NOT NULL DEFAULT false,
  has_email_support BOOLEAN NOT NULL DEFAULT false,
  has_advanced_analytics BOOLEAN NOT NULL DEFAULT false,
  has_group_therapy BOOLEAN NOT NULL DEFAULT false,
  has_dedicated_therapist_matching BOOLEAN NOT NULL DEFAULT false,
  has_custom_wellness_plans BOOLEAN NOT NULL DEFAULT false,
  psychological_assessments_limit INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  is_annual BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ai_conversations_used INTEGER NOT NULL DEFAULT 0,
  professional_sessions_used INTEGER NOT NULL DEFAULT 0,
  psychological_assessments_used INTEGER NOT NULL DEFAULT 0,
  current_month INTEGER NOT NULL DEFAULT EXTRACT(MONTH FROM now()),
  current_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, current_month, current_year)
);

-- Create session pricing table
CREATE TABLE public.session_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER,
  price INTEGER NOT NULL, -- Price in paise
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public readable)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage subscription plans" 
ON public.subscription_plans 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.user_subscriptions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_usage
CREATE POLICY "Users can view their own usage" 
ON public.user_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.user_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage records" 
ON public.user_usage 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for session_pricing (public readable)
CREATE POLICY "Anyone can view session pricing" 
ON public.session_pricing 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage session pricing" 
ON public.session_pricing 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, monthly_price, annual_price, features, ai_conversations_limit, professional_sessions_limit, has_voice_therapy, has_community_access, community_read_only, psychological_assessments_limit) VALUES
('Freemium Foundation', 0, 0, 
'["5 AI conversations per month", "Basic mood tracking", "1 psychological assessment per month", "Community access (read-only)", "Educational resources"]'::jsonb, 
5, 0, false, true, true, 1),

('Essential Plan', 49900, 32435, -- 35% discount annually
'["Unlimited AI conversations", "1 professional session per month", "Complete assessment suite", "Full community features", "Voice therapy access"]'::jsonb, 
NULL, 1, true, true, false, NULL),

('Growth Plan', 89900, 58435, -- 35% discount annually
'["2 professional sessions per month", "Priority AI support", "Advanced analytics", "Group therapy access", "Email support"]'::jsonb, 
NULL, 2, true, true, false, NULL),

('Pro Plan', 149900, 97435, -- 35% discount annually
'["4 professional sessions per month", "Dedicated therapist matching", "Crisis support access", "Phone support", "Custom wellness plans"]'::jsonb, 
NULL, 4, true, true, false, NULL);

-- Update Growth Plan with additional features
UPDATE public.subscription_plans 
SET has_priority_support = true, has_advanced_analytics = true, has_group_therapy = true, has_email_support = true
WHERE name = 'Growth Plan';

-- Update Pro Plan with additional features
UPDATE public.subscription_plans 
SET has_priority_support = true, has_advanced_analytics = true, has_group_therapy = true, has_email_support = true, has_crisis_support = true, has_phone_support = true, has_dedicated_therapist_matching = true, has_custom_wellness_plans = true
WHERE name = 'Pro Plan';

-- Insert session pricing
INSERT INTO public.session_pricing (session_type, duration_minutes, price, description) VALUES
('standard', 45, 79900, 'Individual therapy session with certified professionals'),
('extended', 60, 109900, 'Extended therapy session for deeper exploration'),
('group', NULL, 39900, 'Therapeutic group sessions with shared experiences'),
('crisis', NULL, 129900, 'Emergency mental health support when you need it most');

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_id UUID)
RETURNS TABLE(
  plan_name TEXT,
  is_annual BOOLEAN,
  status TEXT,
  expires_at TIMESTAMPTZ,
  ai_conversations_limit INTEGER,
  professional_sessions_limit INTEGER,
  has_voice_therapy BOOLEAN,
  has_community_access BOOLEAN,
  community_read_only BOOLEAN,
  has_priority_support BOOLEAN,
  has_crisis_support BOOLEAN,
  has_phone_support BOOLEAN,
  has_email_support BOOLEAN,
  has_advanced_analytics BOOLEAN,
  has_group_therapy BOOLEAN,
  has_dedicated_therapist_matching BOOLEAN,
  has_custom_wellness_plans BOOLEAN,
  psychological_assessments_limit INTEGER
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    sp.name,
    us.is_annual,
    us.status,
    us.expires_at,
    sp.ai_conversations_limit,
    sp.professional_sessions_limit,
    sp.has_voice_therapy,
    sp.has_community_access,
    sp.community_read_only,
    sp.has_priority_support,
    sp.has_crisis_support,
    sp.has_phone_support,
    sp.has_email_support,
    sp.has_advanced_analytics,
    sp.has_group_therapy,
    sp.has_dedicated_therapist_matching,
    sp.has_custom_wellness_plans,
    sp.psychological_assessments_limit
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = $1
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
  ORDER BY us.created_at DESC
  LIMIT 1;
$$;

-- Function to get user's current usage for the month
CREATE OR REPLACE FUNCTION get_user_usage(user_id UUID)
RETURNS TABLE(
  ai_conversations_used INTEGER,
  professional_sessions_used INTEGER,
  psychological_assessments_used INTEGER
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(uu.ai_conversations_used, 0),
    COALESCE(uu.professional_sessions_used, 0),
    COALESCE(uu.psychological_assessments_used, 0)
  FROM public.user_usage uu
  WHERE uu.user_id = $1
    AND uu.current_month = EXTRACT(MONTH FROM now())
    AND uu.current_year = EXTRACT(YEAR FROM now())
  UNION ALL
  SELECT 0, 0, 0
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_usage uu
    WHERE uu.user_id = $1
      AND uu.current_month = EXTRACT(MONTH FROM now())
      AND uu.current_year = EXTRACT(YEAR FROM now())
  )
  LIMIT 1;
$$;
