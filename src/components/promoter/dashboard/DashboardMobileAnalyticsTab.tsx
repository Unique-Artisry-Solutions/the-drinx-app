
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Smartphone, MapPin, Bell, TrendingUp } from 'lucide-react';
import { useMobileAnalytics } from '@/hooks/useMobileAnalytics';
import MobileUsageTracker from '@/components/mobile-analytics/MobileUsageTracker';
import LocationAnalytics from '@/components/mobile-analytics/LocationAnalytics';
import PushNotificationAnalytics from '@/components/mobile-analytics/PushNotificationAnalytics';
import MobileConversionOptimizer from '@/components/mobile-analytics/MobileConversionOptimizer';

interface DashboardMobileAnalyticsTabProps {
  promoterId: string;
}

const DashboardMobileAnalyticsTab: React.FC<DashboardMobileAnalyticsTabProps> = ({
  promoterId
}) => {
  const [activeTab, setActiveTab] = useState('usage');
  const { 
    mobileMetrics, 
    locationMetrics, 
    pushMetrics, 
    conversionMetrics, 
    isLoading, 
    error,
    refresh 
  } = useMobileAnalytics(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading mobile analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mobile Analytics</h2>
          <p className="text-muted-foreground">
            Track mobile app usage, location data, and conversion metrics
          </p>
        </div>
        <Badge variant="outline" className="text-green-600">
          Live Mobile Data
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Active Users</div>
            </div>
            <div className="text-2xl font-bold mt-1">{mobileMetrics.activeUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Location Events</div>
            </div>
            <div className="text-2xl font-bold mt-1">{locationMetrics.totalEvents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Push Open Rate</div>
            </div>
            <div className="text-2xl font-bold mt-1">{pushMetrics.openRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Mobile Conversion</div>
            </div>
            <div className="text-2xl font-bold mt-1">{conversionMetrics.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="usage">App Usage</TabsTrigger>
          <TabsTrigger value="location">Location Analytics</TabsTrigger>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <MobileUsageTracker metrics={mobileMetrics} promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="location">
          <LocationAnalytics metrics={locationMetrics} promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="push">
          <PushNotificationAnalytics metrics={pushMetrics} promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="conversion">
          <MobileConversionOptimizer metrics={conversionMetrics} promoterId={promoterId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardMobileAnalyticsTab;
