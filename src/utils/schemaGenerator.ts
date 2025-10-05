// Schema.org structured data generator utilities

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchema {
  headline: string;
  datePublished: string;
  dateModified: string;
  author: string;
  description: string;
  image: string;
  url: string;
}

export interface VideoSchema {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateArticleSchema = (article: ArticleSchema) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Chetna AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chetna.live/logo.png"
      }
    },
    "description": article.description,
    "image": article.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
};

export const generateVideoSchema = (video: VideoSchema) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "duration": video.duration,
    "contentUrl": video.contentUrl
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Chetna AI",
    "image": "https://chetna.live/logo.png",
    "url": "https://chetna.live",
    "telephone": "+1-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Online",
      "addressRegion": "Global",
      "postalCode": "",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 0,
      "longitude": 0
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://twitter.com/Keshav_Kumar_04"
    ],
    "priceRange": "Free - $$"
  };
};

export const generateWebApplicationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chetna AI",
    "url": "https://chetna.live",
    "description": "AI-powered mental wellness companion providing 24/7 support for anxiety, depression, and stress management",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "95"
    }
  };
};

export const generateHowToSchema = (steps: string[], name: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    }))
  };
};
