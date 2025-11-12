import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Custom hook to track page views and user interactions
 * Automatically sends page view events when route changes
 */
export const usePageAnalytics = (pageName?: string) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view with Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: pageName || document.title,
        page_location: window.location.href,
      });
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Page Analytics:', {
        page: location.pathname,
        title: pageName || document.title,
      });
    }
  }, [location, pageName]);

  // Track custom events
  const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...eventParams,
        page_path: location.pathname,
      });
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Event Tracked:', eventName, eventParams);
    }
  };

  // Track button clicks
  const trackButtonClick = (buttonName: string, additionalData?: Record<string, any>) => {
    trackEvent('button_click', {
      button_name: buttonName,
      ...additionalData,
    });
  };

  // Track form submissions
  const trackFormSubmit = (formName: string, success: boolean) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
    });
  };

  return {
    trackEvent,
    trackButtonClick,
    trackFormSubmit,
  };
};

export default usePageAnalytics;
