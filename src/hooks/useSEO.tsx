
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const useSEO = (data: SEOData) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (data.title) {
      document.title = data.title;
    }

    // Update meta description
    if (data.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', data.description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', data.description);
        document.head.appendChild(metaDescription);
      }
    }

    // Update canonical URL
    if (data.canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', data.canonical);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', data.canonical);
        document.head.appendChild(canonicalLink);
      }
    }

    // Track page views for analytics (only if gtag is available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
        page_title: data.title || document.title,
      });
    }
    
    // Track custom page view event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: data.title || document.title,
      });
    }
  }, [data, location]);
};

export default useSEO;
