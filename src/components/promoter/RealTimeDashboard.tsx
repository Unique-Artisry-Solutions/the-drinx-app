
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useOptimizedRealTimeAnalytics } from '@/hooks/useOptimizedRealTimeAnalytics';
import AnalyticsErrorBoundary from '@/components/analytics/AnalyticsErrorBoundary';

const RealTimeDashboard: React.FC = () => {
  const { metrics, isLoading, error } = useOptimizedRealTimeAnalytics({
    enableRealTime: true,
    refreshInterval: 30000
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading real-time dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <AnalyticsErrorBoundary>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-500">Error loading dashboard: {error}</p>
            </div>
          </CardContent>
        </Card>
      </AnalyticsErrorBoundary>
    );
  }

  return (
    <AnalyticsErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse text-blue-500" />
            Real-Time Dashboard
          </CardTitle>
          <CardDescription>
            Live performance metrics for your promotional events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Users active now</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Page Views</span>
              </div>
              <div className="text-2xl font-bold">{metrics.pageViews}</div>
              <p className="text-xs text-muted-foreground">Views today</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Conversions</span>
              </div>
              <div className="text-2xl font-bold">{metrics.conversions}</div>
              <p className="text-xs text-muted-foreground">Conversions today</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="text-2xl font-bold">${metrics.revenue}</div>
              <p className="text-xs text-muted-foreground">Revenue today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnalyticsErrorBoundary>
  );
};

export default RealTimeDashboard;
