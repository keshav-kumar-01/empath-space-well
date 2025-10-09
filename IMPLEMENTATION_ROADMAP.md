# Implementation Roadmap for Investment Readiness

This document outlines the specific technical implementations needed to make Chetna AI investment-ready.

---

## Phase 1: Revenue Generation (Week 1-2)

### 1. Stripe Payment Integration

**Why Critical:** Cannot generate revenue without payment system

**Implementation Steps:**
```bash
# 1. Enable Stripe integration in Lovable
- Use the Stripe integration tool in Lovable
- Collect Stripe secret key from user
- Stripe will auto-configure webhook endpoints

# 2. Create subscription products in Stripe (handled by integration):
- Freemium Foundation (₹0)
- Essential Plan (₹499/month, ₹3,894/year)
- Growth Plan (₹899/month, ₹7,019/year) 
- Pro Plan (₹1,499/month, ₹11,695/year)

# 3. Implement in frontend:
- Add Stripe checkout buttons to pricing page
- Create billing portal for users
- Add subscription status to user profile
- Implement upgrade/downgrade flows
```

**Files to Modify:**
- `src/pages/Pricing.tsx` - Add Stripe checkout buttons
- `src/pages/Settings.tsx` - Add billing management
- `src/pages/UserProfile.tsx` - Show subscription status
- Create new components:
  - `src/components/SubscriptionManager.tsx`
  - `src/components/PaymentModal.tsx`

**Supabase Tables Needed:**
```sql
-- User subscription status (Stripe handles this via webhook)
-- The Stripe integration creates this automatically
```

### 2. Feature Gating Based on Subscription

**Implementation:**
```typescript
// src/hooks/useSubscription.ts
export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  
  // Check user's subscription tier
  // Limit features based on tier
  // Return: { tier, canAccessFeature(), remainingChats }
}
```

**Apply to:**
- AI Chat (limit to 5/month for free tier)
- Psychological tests (1/month for free)
- Community posting (read-only for free)
- Journal entries (unlimited vs limited)

---

## Phase 2: Analytics & Tracking (Week 1-2)

### 1. Google Analytics 4 Setup

**Implementation:**
```typescript
// src/utils/analytics.ts
export const trackEvent = (eventName: string, params?: object) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
};

// Track conversions
export const trackConversion = (value: number, currency: string = 'INR') => {
  trackEvent('purchase', { value, currency });
};
```

**Events to Track:**
- User signup
- Subscription purchase
- Feature usage (AI chat, tests, etc.)
- Upgrade prompt views
- Free trial starts
- Churn events

### 2. Conversion Funnel Tracking

**Funnels to Monitor:**
1. **Landing → Signup:**
   - Landing page view
   - Signup button click
   - Form completion
   - Email verification

2. **Free → Paid:**
   - Pricing page view
   - Plan selection
   - Checkout started
   - Payment completed

3. **Feature Adoption:**
   - Feature discovery
   - First use
   - Regular usage (3+ times)
   - Power user (weekly)

### 3. Custom Dashboard (Future - Month 2-3)

**Metrics to Display:**
```typescript
// Admin dashboard showing:
- MRR growth chart
- User acquisition trends
- Conversion rates
- Churn cohorts
- LTV:CAC ratio
- Feature usage heatmap
```

---

## Phase 3: Legal & Compliance (Week 2-4)

### 1. Enhanced Medical Disclaimers

**Locations to Add:**
- Home page hero section
- Before first AI chat
- Psychological test pages
- Therapist booking flow

**Template:**
```typescript
const MedicalDisclaimer = () => (
  <Alert variant="warning" className="my-4">
    <Shield className="h-4 w-4" />
    <AlertTitle>Important Medical Notice</AlertTitle>
    <AlertDescription>
      Chetna AI is not a substitute for professional medical advice, diagnosis, 
      or treatment. If you are experiencing a mental health emergency, please 
      contact emergency services or call the national mental health helpline 
      immediately: <strong>+91-9152987821</strong>
    </AlertDescription>
  </Alert>
);
```

### 2. Crisis Intervention Protocol

**Implementation:**
```typescript
// src/utils/crisisDetection.ts
export const detectCrisisKeywords = (message: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'self harm', 'hurt myself', 'no reason to live'
  ];
  
  return crisisKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
};

// If detected, immediately show:
<CrisisAlert>
  <p>We're concerned about you. Please reach out to:</p>
  <ul>
    <li>Emergency: 112 or 102</li>
    <li>Mental Health Helpline: +91-9152987821</li>
    <li>Vandrevala Foundation: 1860-2662-345</li>
  </ul>
  <Button>Connect to Crisis Counselor</Button>
</CrisisAlert>
```

### 3. Therapist Verification System

**New Feature:**
```typescript
// Admin panel for therapist verification
interface TherapistVerification {
  license_number: string;
  license_state: string;
  license_expiry: Date;
  verification_documents: string[]; // URLs to uploaded docs
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by: string; // Admin user ID
  verified_at: Date;
}
```

**Display verified badge:**
```typescript
<Badge variant="success">
  <ShieldCheck className="h-3 w-3 mr-1" />
  Verified Therapist
</Badge>
```

---

## Phase 4: Growth Optimization (Week 3-4)

### 1. Email Marketing Automation

**Sequences to Implement:**

**A. Onboarding Sequence:**
- Day 0: Welcome email + first steps
- Day 1: "Take your first assessment"
- Day 3: "Join our community"
- Day 7: "Upgrade to unlock unlimited AI chats"

**B. Re-engagement:**
- Day 7 inactive: "We miss you"
- Day 14 inactive: "Here's what you're missing"
- Day 30 inactive: "Last chance - special offer"

**C. Upgrade Prompts:**
- After 5 free chats: "You've reached your limit"
- After 1 test: "Get unlimited assessments"
- Week 2 of free tier: "See what Premium offers"

**Tools:**
- Resend.com (email API)
- Or integrate with SendGrid/Mailchimp

### 2. In-App Upgrade Prompts

**Strategic Placements:**
```typescript
// src/components/UpgradePrompt.tsx
<Modal show={userHitLimit}>
  <h3>You've used all 5 free chats this month</h3>
  <p>Upgrade to Essential for unlimited conversations</p>
  <Button>Upgrade Now - Only ₹499/month</Button>
  <Button variant="ghost">Wait until next month</Button>
</Modal>
```

**Trigger Points:**
- After 5 AI chats (free tier limit)
- After 1 psychological test
- When viewing community (for read-only users)
- When trying to book therapist session

### 3. Referral Program

**Implementation:**
```typescript
// Generate unique referral codes
const generateReferralCode = (userId: string) => {
  return `CHETNA-${userId.substring(0, 8).toUpperCase()}`;
};

// Rewards structure:
- Referrer: ₹100 credit or 1 free month
- Referee: 20% off first month

// Track in database:
create table referrals (
  id uuid primary key,
  referrer_id uuid references auth.users,
  referee_id uuid references auth.users,
  referral_code text,
  status text, -- 'pending', 'completed', 'rewarded'
  reward_given boolean default false,
  created_at timestamp default now()
);
```

---

## Phase 5: Product Differentiation (Month 2-3)

### 1. Enhanced AI Personalization

**Current:** Generic AI responses  
**Needed:** Context-aware, personalized responses

**Implementation:**
```typescript
// Store user context
interface UserContext {
  previous_tests: TestResult[];
  mood_history: MoodEntry[];
  conversation_topics: string[];
  user_preferences: {
    communication_style: 'empathetic' | 'direct' | 'practical';
    language_preference: string;
    therapy_goals: string[];
  };
}

// Pass to AI in system prompt
const generatePersonalizedPrompt = (user: UserContext) => {
  return `You are Dr. Chetna. This user has:
  - Recent anxiety (GAD-7 score: 15)
  - Struggled with work stress
  - Prefers empathetic communication
  - Indian cultural context
  
  Tailor your response accordingly...`;
};
```

### 2. Community Features Enhancement

**Add:**
- Topic-based groups (anxiety, depression, work stress)
- Expert AMAs (therapists answer questions)
- Success story sharing
- Peer matching for accountability partners

### 3. Progress Tracking Dashboard

**Visual Dashboard:**
```typescript
<DashboardStats>
  <StatCard title="Mood Trend" value="+15% this month" />
  <StatCard title="Consistency" value="7 day streak" />
  <StatCard title="AI Chats" value="23 conversations" />
  <StatCard title="Tests Completed" value="3 assessments" />
</DashboardStats>

<MoodChart data={last30DaysMood} />
<GoalsProgress goals={userGoals} />
<Insights insights={aiGeneratedInsights} />
```

---

## Phase 6: Marketing Infrastructure (Month 2-3)

### 1. SEO Content Strategy

**Blog Post Ideas:**
- "10 Signs You Need to Talk to Someone About Anxiety"
- "How AI Therapy Compares to Traditional Therapy"
- "Mental Health in Indian Workplaces: A Complete Guide"
- "GAD-7 Test: Understanding Your Anxiety Score"
- "Affordable Mental Health Support in India"

**Implementation:**
```typescript
// Each blog post optimized for:
- Target keyword (e.g., "anxiety test online")
- Internal links to tests/features
- Clear CTA to sign up
- Social sharing buttons
```

### 2. Landing Pages for Personas

**Target Audiences:**
- Students (exam stress, career anxiety)
- Working professionals (burnout, work-life balance)
- Parents (parenting stress, relationship issues)
- Caregivers (compassion fatigue)

**Each landing page:**
- Persona-specific copy
- Relevant testimonials
- Targeted feature highlights
- Special offers

### 3. Social Proof Implementation

**Add Throughout Site:**
```typescript
<TestimonialCarousel>
  {testimonials.map(t => (
    <Testimonial>
      <Quote>{t.text}</Quote>
      <Author>{t.name}, {t.role}</Author>
      <Rating value={5} />
    </Testimonial>
  ))}
</TestimonialCarousel>

<TrustBadges>
  <Badge>1000+ Users Trust Us</Badge>
  <Badge>95% Satisfaction Rate</Badge>
  <Badge>Available 24/7</Badge>
</TrustBadges>
```

---

## Technical Debt to Address

### Performance Optimizations
1. **Image Optimization:**
   - Use WebP format
   - Implement lazy loading (✅ Created OptimizedImage component)
   - Add CDN (Cloudflare/Cloudinary)

2. **Code Splitting:**
   - Route-based splitting (✅ Already done)
   - Component lazy loading
   - Reduce bundle size

3. **Caching Strategy:**
   - Cache static content
   - Implement service worker for PWA
   - Cache API responses

### Security Enhancements
1. **Rate Limiting:**
   - API endpoints
   - AI chat requests
   - Auth attempts

2. **Input Validation:**
   - All form inputs (✅ Created validation utils)
   - File uploads
   - SQL injection prevention

3. **Monitoring:**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

---

## Success Metrics for Investment Readiness

### Must Have Before Fundraising:
- [ ] 500+ registered users
- [ ] 50+ paying subscribers  
- [ ] ₹50,000+ MRR
- [ ] 40%+ D30 retention rate
- [ ] Positive unit economics (LTV > 3x CAC)
- [ ] 2-3 proven marketing channels
- [ ] All compliance issues resolved
- [ ] Healthcare advisor on board

### Nice to Have:
- [ ] 5,000+ users
- [ ] ₹2L+ MRR
- [ ] Profitability or path to profitability
- [ ] Strategic partnerships
- [ ] Press coverage / awards

---

## Timeline Summary

| Week | Focus | Key Deliverables |
|------|-------|------------------|
| 1-2 | Revenue | Stripe integration, feature gating, analytics |
| 2-3 | Legal | Disclaimers, crisis protocol, therapist verification |
| 3-4 | Growth | Email automation, referral program, upgrade flows |
| 5-8 | Scale | Marketing campaigns, 100 users, ₹10K MRR |
| 9-12 | Optimize | Improve conversion, reduce churn, add features |
| 13-24 | Fundraise | 500 users, ₹50K MRR, investor outreach |

---

**Next Action:** Review this with founders and prioritize based on available resources and skills.
