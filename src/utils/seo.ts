/**
 * SEO Utilities for consistent meta tags and structured data
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
 * Generate default SEO config for pages
 */
export const generateSEOConfig = (config: SEOConfig): SEOConfig => {
  const baseUrl = 'https://chetna.live';
  
  return {
    ...config,
    url: config.url || baseUrl,
    image: config.image || `${baseUrl}/og-image.png`,
    type: config.type || 'website',
  };
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: {
    title: 'Chetna AI - Your Mental Wellness Companion | AI-Powered Mental Health Support',
    description: 'Get compassionate AI support for anxiety, depression, stress management, and mental health challenges. Start your wellness journey with Chetna AI today - available 24/7.',
    keywords: 'mental health AI, anxiety support, depression help, stress management, emotional wellness, AI therapy',
    url: 'https://chetna.live',
  },
  about: {
    title: 'About Chetna AI - Meet Your AI Mental Health Companion',
    description: 'Learn about Chetna AI, the compassionate AI-powered mental health platform helping thousands find support and wellness.',
    keywords: 'about chetna ai, mental health platform, ai therapy, mental wellness',
    url: 'https://chetna.live/about',
  },
  blog: {
    title: 'Mental Health Blog - Chetna AI',
    description: 'Explore articles, tips, and insights on mental health, wellness, and emotional wellbeing from Chetna AI experts.',
    keywords: 'mental health blog, wellness articles, mental health tips',
    url: 'https://chetna.live/blog',
  },
  resources: {
    title: 'Mental Health Resources Library - Chetna AI',
    description: 'Access our comprehensive library of mental health resources, exercises, guides, and tools for emotional wellbeing.',
    keywords: 'mental health resources, wellness exercises, therapy tools',
    url: 'https://chetna.live/resources',
  },
  tests: {
    title: 'Psychological Tests & Assessments - Chetna Quest',
    description: 'Take scientifically validated psychological assessments to understand your mental health better. Free and confidential.',
    keywords: 'psychological tests, mental health assessment, anxiety test, depression test',
    url: 'https://chetna.live/quiz',
  },
  community: {
    title: 'Mental Health Community - Share & Support',
    description: 'Join a supportive community where you can share experiences, find support, and connect with others on similar journeys.',
    keywords: 'mental health community, support group, peer support',
    url: 'https://chetna.live/community',
  },
  pricing: {
    title: 'Pricing Plans - Chetna AI',
    description: 'Choose the right plan for your mental wellness journey. Free and premium options available.',
    keywords: 'mental health pricing, therapy plans, subscription',
    url: 'https://chetna.live/pricing',
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
    image: article.image || 'https://chetna.live/og-image.png',
    url: article.url,
  };
};
