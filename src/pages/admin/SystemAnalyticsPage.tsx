
import React, { useEffect } from 'react';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';

const SystemAnalyticsPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  
  // Track page view
  useEffect(() => {
    trackPage('admin_analytics_page');
  }, [trackPage]);

  return (
    <>
      <AnalyticsService pageView="admin_analytics" />
      
      <div className="container mx-auto p-6">
        <AnalyticsDashboard />
      </div>
    </>
  );
};

export default SystemAnalyticsPage;
