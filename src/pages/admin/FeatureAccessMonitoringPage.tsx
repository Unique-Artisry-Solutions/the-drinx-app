
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import { useAnalytics } from '@/hooks/useAnalytics';
import FeatureAccessMetrics from '@/components/admin/systemConfiguration/FeatureAccessMetrics';
import { Layers, BarChart, Users } from 'lucide-react';
import FeatureSegmentMonitoring from '@/components/admin/systemConfiguration/FeatureSegmentMonitoring';
import FeatureAnalyticsTab from '@/components/admin/systemConfiguration/tabs/FeatureAnalyticsTab';

const FeatureAccessMonitoringPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  const [activeTab, setActiveTab] = useState<string>('metrics');
  
  useEffect(() => {
    trackPage('admin_feature_access_monitoring');
  }, [trackPage]);
  
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Feature Access Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Monitor feature usage, access patterns, and manage feature flags
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Access Metrics
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Feature Segments
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className={activeTab === 'metrics' ? 'block' : 'hidden'}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Feature Access Metrics</CardTitle>
                <CardDescription>
                  Monitor which features are being accessed and by whom
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureAccessMetrics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className={activeTab === 'analytics' ? 'block' : 'hidden'}>
            <FeatureAnalyticsTab />
          </TabsContent>
          
          <TabsContent value="segments" className={activeTab === 'segments' ? 'block' : 'hidden'}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Feature Segments</CardTitle>
                <CardDescription>
                  Manage user segments with access to specific features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureSegmentMonitoring />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeatureAccessMonitoringPage;
