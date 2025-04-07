
import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsServiceProps {
  pageView?: string;
  trackPageview?: boolean;
  children?: React.ReactNode;
}

/**
 * A component that automatically tracks page views and provides analytics services
 * This can be included on admin pages to automatically track visits
 */
const AnalyticsService: React.FC<AnalyticsServiceProps> = ({ 
  pageView, 
  trackPageview = true, 
  children 
}) => {
  const { track } = useAnalytics();
  
  useEffect(() => {
    if (trackPageview) {
      const pageName = pageView || window.location.pathname;
      track('page_view', { page: pageName });
    }
  }, [pageView, trackPageview, track]);
  
  // This component doesn't render anything visible
  return <>{children}</>;
};

export default AnalyticsService;
