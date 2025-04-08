
import React from 'react';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';

const SystemAnalyticsPage: React.FC = () => {
  const { track } = useAnalytics();
  
  // Track page view
  React.useEffect(() => {
    track('admin_analytics_page_view');
  }, [track]);

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
