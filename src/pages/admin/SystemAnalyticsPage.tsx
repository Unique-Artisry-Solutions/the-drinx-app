
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';

const SystemAnalyticsPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  
  // Track page view
  useEffect(() => {
    trackPage('admin_analytics_page');
  }, [trackPage]);

  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Platform-wide analytics and insights for the Drinx app
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              View and analyze system-wide metrics across all users and establishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This dashboard presents comprehensive analytics data about user engagement,
              feature usage, and platform growth. Use the filters and tabs below to 
              explore different aspects of the Drinx app's performance.
            </p>
          </CardContent>
        </Card>
        
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;
