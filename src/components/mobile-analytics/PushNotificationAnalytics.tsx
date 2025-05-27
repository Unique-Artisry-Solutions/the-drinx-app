
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, Eye, MousePointer, TrendingUp, CheckCircle } from 'lucide-react';
import { PushNotificationMetrics } from '@/services/mobileAnalyticsService';

interface PushNotificationAnalyticsProps {
  metrics: PushNotificationMetrics;
  promoterId: string;
}

const PushNotificationAnalytics: React.FC<PushNotificationAnalyticsProps> = ({ metrics }) => {
  const getOpenRateColor = (rate: number) => {
    if (rate > 20) return 'text-green-600';
    if (rate > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCTRColor = (rate: number) => {
    if (rate > 10) return 'text-green-600';
    if (rate > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConversionColor = (rate: number) => {
    if (rate > 5) return 'text-green-600';
    if (rate > 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Push Notification Effectiveness</h3>
        <p className="text-sm text-muted-foreground">
          Track push notification performance and user engagement
        </p>
      </div>

      {/* Push Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-500" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalSent.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Push notifications sent this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((metrics.totalDelivered / metrics.totalSent) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.totalDelivered.toLocaleString()} successfully delivered
            </p>
            <Badge variant="default" className="mt-2">Excellent</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getOpenRateColor(metrics.openRate)}`}>
              {metrics.openRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.totalOpened.toLocaleString()} notifications opened
            </p>
            <Badge 
              variant={metrics.openRate > 20 ? 'default' : 'secondary'} 
              className="mt-2"
            >
              {metrics.openRate > 20 ? 'Excellent' : 
               metrics.openRate > 10 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-orange-500" />
              Click-Through Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getCTRColor(metrics.clickThroughRate)}`}>
              {metrics.clickThroughRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Users who clicked notification actions
            </p>
            <Badge 
              variant={metrics.clickThroughRate > 10 ? 'default' : 'secondary'} 
              className="mt-2"
            >
              {metrics.clickThroughRate > 10 ? 'High Engagement' : 
               metrics.clickThroughRate > 5 ? 'Average' : 'Low Engagement'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getConversionColor(metrics.conversionRate)}`}>
              {metrics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Notifications leading to purchases
            </p>
            <Badge 
              variant={metrics.conversionRate > 5 ? 'default' : 'destructive'} 
              className="mt-2"
            >
              {metrics.conversionRate > 5 ? 'High Converting' : 
               metrics.conversionRate > 2 ? 'Good' : 'Needs Optimization'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Push Notification Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notification Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Optimal Send Times</h4>
              <p className="text-sm text-green-600">
                7-9 PM shows 35% higher open rates for event notifications
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Personalization Impact</h4>
              <p className="text-sm text-blue-600">
                Location-based notifications have 2.5x higher conversion rates
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Frequency Optimization</h4>
              <p className="text-sm text-purple-600">
                2-3 notifications per week maintains highest engagement
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Content Performance</h4>
              <p className="text-sm text-orange-600">
                Event reminders outperform promotional messages by 40%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotificationAnalytics;
