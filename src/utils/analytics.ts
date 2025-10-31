import { useEffect } from "react";

const analytics = {
  trackEvent: (event: string, data: Record<string, unknown>) => {
    if (typeof data === "object" && data !== null) {
      console.log(`Event tracked: ${event}`, data);
    } else {
      console.log(`Event tracked: ${event} (no additional data)`);
    }
    // Here you would typically send the event to your analytics service
  },

  trackPageView: (page: string) => {
    console.log(`Page viewed: ${page}`);
    // Here you would typically send the page view to your analytics service
  },

  init: () => {
    // Initialize analytics service here
    console.log("Analytics initialized");
  },
};

export const useAnalytics = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  return analytics;
};
