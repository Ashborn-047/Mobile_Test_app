import { useEffect } from 'react';

const analytics = {
  trackEvent: (event: string, data: Record<string, any>) => {
    console.log(`Event tracked: ${event}`, data);
    // Here you would typically send the event to your analytics service
  },

  trackPageView: (page: string) => {
    console.log(`Page viewed: ${page}`);
    // Here you would typically send the page view to your analytics service
  },

  init: () => {
    // Initialize analytics service here
    console.log('Analytics initialized');
  }
};

export const useAnalytics = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  return analytics;
};