
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsDashboard from '@/components/admin/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SegmentAnalyticsDashboard } from '@/components/admin/audience/analytics/SegmentAnalyticsDashboard';
import { BarChart3, Users } from 'lucide-react';

const SystemAnalyticsPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  const [activeTab, setActiveTab] = useState('general');
  
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
            Platform-wide analytics and insights for the Spiritless application
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              General Analytics
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Audience Segments
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TabsContent value="general" className={activeTab === 'general' ? 'block' : 'hidden'}>
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
                explore different aspects of the system's performance.
              </p>
            </CardContent>
          </Card>
          
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="audience" className={activeTab === 'audience' ? 'block' : 'hidden'}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Audience Segment Analytics</CardTitle>
              <CardDescription>
                In-depth analysis of your audience segments and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Track the performance of your audience segments, analyze audience overlap,
                and generate reports for stakeholders. Use this data to optimize your targeting
                strategy and improve marketing campaign effectiveness.
              </p>
            </CardContent>
          </Card>
          
          <SegmentAnalyticsDashboard />
        </TabsContent>
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;
