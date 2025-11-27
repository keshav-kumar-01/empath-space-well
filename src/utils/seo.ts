/**
 * SEO Utilities for consistent meta tags and structured data
 * Optimized for ranking on Google, ChatGPT, and all AI/NLP platforms
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

/**
 * Core keywords for mental health AI platform
 */
export const coreKeywords = [
  'mental health AI',
  'AI therapy',
  'mental wellness AI',
  'health AI',
  'mental health support',
  'chetna',
  'chetna ai',
  'chetna_ai',
  'psychological tests online',
  'psychologist appointment',
  'online therapy',
  'mental health chatbot',
  'anxiety help AI',
  'depression support AI',
  'stress management AI',
  'emotional wellness',
  'AI mental health companion',
  'therapy AI assistant',
  'mental health assessment',
  'psychological evaluation',
  'mental wellness platform',
  'AI counseling',
  'mental health diagnosis AI',
  'therapy chatbot',
  'AI psychiatrist',
  'mental health screening',
  'psychological tests',
  'mental health tools',
].join(', ');

/**
 * Generate default SEO config for pages
 */
export const generateSEOConfig = (config: SEOConfig): SEOConfig => {
  const baseUrl = 'https://chetna.life';
  
  return {
    ...config,
    url: config.url || baseUrl,
    image: config.image || `${baseUrl}/og-image.png`,
    type: config.type || 'website',
  };
};

/**
 * Page-specific SEO configurations - Optimized for top rankings
 */
export const pageSEO = {
  home: {
    title: 'Chetna AI - Mental Health AI | Mental Wellness Companion | AI Therapy & Psychological Support',
    description: 'Chetna AI is the leading mental health AI platform providing 24/7 AI therapy, psychological tests, psychologist appointments, and mental wellness support. Get instant help for anxiety, depression, stress with our AI mental health companion.',
    keywords: `${coreKeywords}, mental health app, therapy app, wellness app, AI mental health, mental health diagnosis, therapy online, counseling AI, mental wellness solutions`,
    url: 'https://chetna.life',
  },
  aiFeatures: {
    title: 'AI Mental Health Features - AI Therapy, Voice Therapy & Emotion Recognition | Chetna AI',
    description: 'Explore advanced AI mental health features: AI therapy chatbot, voice therapy sessions, emotion recognition, dream analysis, and personalized mental wellness plans. 24/7 AI-powered mental health support.',
    keywords: `AI therapy, mental health AI features, voice therapy, emotion recognition AI, dream analysis AI, AI counseling, mental health chatbot, therapy AI, ${coreKeywords}`,
    url: 'https://chetna.life/ai-features',
  },
  about: {
    title: 'About Chetna AI - Leading Mental Health AI Platform | AI Therapy & Wellness',
    description: 'Learn about Chetna AI, the pioneering mental health AI platform revolutionizing therapy and mental wellness. Our AI-powered platform helps thousands daily with anxiety, depression, and stress management.',
    keywords: `about chetna ai, mental health AI platform, AI therapy company, mental wellness technology, ${coreKeywords}`,
    url: 'https://chetna.life/about',
  },
  blog: {
    title: 'Mental Health Blog - AI Therapy Insights & Wellness Tips | Chetna AI',
    description: 'Read expert articles on mental health, AI therapy, psychological wellness, and emotional support. Latest insights on anxiety, depression, stress management from Chetna AI mental health experts.',
    keywords: `mental health blog, AI therapy articles, wellness tips, mental health insights, therapy blog, psychology articles, ${coreKeywords}`,
    url: 'https://chetna.life/blog',
  },
  resources: {
    title: 'Mental Health Resources Library - Free Tools, Guides & Exercises | Chetna AI',
    description: 'Access comprehensive mental health resources: therapy guides, wellness exercises, coping tools, meditation guides. Free mental health resources library powered by AI.',
    keywords: `mental health resources, therapy tools, wellness exercises, mental health guides, therapy resources, coping tools, ${coreKeywords}`,
    url: 'https://chetna.life/resources',
  },
  psychTests: {
    title: 'Psychological Tests Online - Free Mental Health Assessment | GAD-7, PHQ-9, Beck Tests',
    description: 'Take scientifically validated psychological tests online: GAD-7 anxiety test, PHQ-9 depression test, Beck Anxiety/Depression Inventory, MMPI-2. Free, confidential mental health assessments.',
    keywords: `psychological tests, mental health assessment, anxiety test, depression test, GAD-7, PHQ-9, Beck Anxiety Inventory, Beck Depression Inventory, psychological evaluation, mental health screening, ${coreKeywords}`,
    url: 'https://chetna.life/psych-tests',
  },
  appointments: {
    title: 'Book Psychologist Appointment Online - Online Therapy Sessions | Chetna AI',
    description: 'Book appointments with licensed psychologists and therapists online. Schedule therapy sessions, counseling, and mental health consultations. Easy online booking for mental health professionals.',
    keywords: `psychologist appointment, book therapist online, online therapy booking, counseling appointment, mental health consultation, therapy session booking, ${coreKeywords}`,
    url: 'https://chetna.life/appointments',
  },
  moodTracker: {
    title: 'Mood Tracker - Track Mental Health & Emotions | AI Mood Analysis',
    description: 'Track your daily mood and emotions with AI-powered mood tracker. Get insights into mental health patterns, emotional trends, and personalized wellness recommendations.',
    keywords: `mood tracker, emotion tracker, mental health tracker, mood journal, emotional wellness, mental health monitoring, ${coreKeywords}`,
    url: 'https://chetna.life/mood-tracker',
  },
  journal: {
    title: 'Mental Health Journal - Private Digital Journaling for Wellness | Chetna AI',
    description: 'Keep a private mental health journal with AI insights. Digital journaling for emotional wellness, therapy progress tracking, and self-reflection.',
    keywords: `mental health journal, digital journal, therapy journal, wellness diary, emotional journal, journaling for mental health, ${coreKeywords}`,
    url: 'https://chetna.life/journal',
  },
  community: {
    title: 'Mental Health Community - Support Groups & Peer Support | Chetna AI',
    description: 'Join supportive mental health community. Share experiences, find peer support, connect with others facing similar challenges. Safe, moderated mental health support groups.',
    keywords: `mental health community, support groups, peer support, mental health forum, therapy community, wellness community, ${coreKeywords}`,
    url: 'https://chetna.life/community',
  },
  crisisSupport: {
    title: 'Crisis Support - 24/7 Mental Health Emergency Help & Hotlines | Chetna AI',
    description: 'Get immediate mental health crisis support. Access 24/7 crisis hotlines, emergency mental health resources, and instant AI support for urgent situations.',
    keywords: `crisis support, mental health emergency, suicide prevention, crisis hotline, emergency mental health, urgent help, ${coreKeywords}`,
    url: 'https://chetna.life/crisis-support',
  },
  pricing: {
    title: 'Pricing Plans - Affordable Mental Health AI & Therapy | Chetna AI',
    description: 'Affordable mental health AI plans. Choose from free and premium options for AI therapy, psychological tests, and mental wellness support.',
    keywords: `mental health pricing, therapy pricing, AI therapy cost, mental wellness plans, therapy subscription, ${coreKeywords}`,
    url: 'https://chetna.life/pricing',
  },
  dreamAnalysis: {
    title: 'AI Dream Analysis - Interpret Dreams with AI Psychology | Chetna AI',
    description: 'Analyze your dreams with AI-powered dream interpretation. Get psychological insights into dream meanings and patterns.',
    keywords: `dream analysis, AI dream interpretation, dream meaning, dream psychology, ${coreKeywords}`,
    url: 'https://chetna.life/dream-analysis',
  },
  emotionRecognition: {
    title: 'Emotion Recognition AI - Facial Emotion Detection & Analysis | Chetna AI',
    description: 'Advanced AI emotion recognition from facial expressions. Detect and analyze emotions for better mental health awareness.',
    keywords: `emotion recognition, facial emotion detection, AI emotion analysis, emotional AI, ${coreKeywords}`,
    url: 'https://chetna.life/emotion-recognition',
  },
  voiceTherapy: {
    title: 'Voice Therapy AI - Talk Therapy with AI Assistant | Chetna AI',
    description: 'Experience voice therapy with AI. Talk naturally about your mental health concerns with our AI therapy assistant.',
    keywords: `voice therapy, talk therapy AI, voice mental health, AI therapy assistant, ${coreKeywords}`,
    url: 'https://chetna.life/voice-therapy',
  },
  mentalHealthGoals: {
    title: 'Mental Health Goals - Set & Track Wellness Goals | Chetna AI',
    description: 'Set and track mental health goals. Get personalized goal recommendations and progress tracking for mental wellness.',
    keywords: `mental health goals, wellness goals, therapy goals, personal growth, ${coreKeywords}`,
    url: 'https://chetna.life/mental-health-goals',
  },
  wellnessPlans: {
    title: 'Personalized Wellness Plans - AI Mental Health Plans | Chetna AI',
    description: 'Get AI-generated personalized wellness plans. Custom mental health plans tailored to your needs.',
    keywords: `wellness plans, mental health plans, personalized therapy, wellness program, ${coreKeywords}`,
    url: 'https://chetna.life/wellness-plans',
  },
};

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate JSON-LD structured data for articles
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    image: article.image || 'https://chetna.life/og-image.png',
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: 'Chetna AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chetna.life/logo.png'
      }
    }
  };
};

/**
 * Generate Medical/Health specific structured data
 */
export const generateHealthSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Chetna AI - Mental Health AI Platform',
    description: 'AI-powered mental health platform providing therapy, psychological assessments, and wellness support',
    specialty: 'Psychiatry',
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Mental Health Patients'
    },
    about: {
      '@type': 'MedicalCondition',
      name: 'Mental Health',
      alternateName: ['Mental Wellness', 'Psychological Health', 'Emotional Wellbeing']
    }
  };
};

/**
 * Generate Software Application schema for the AI platform
 */
export const generateSoftwareSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Chetna AI',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    },
    description: 'AI-powered mental health platform for therapy, psychological assessments, and wellness support'
  };
};
