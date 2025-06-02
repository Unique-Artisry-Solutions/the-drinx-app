
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

interface RealTimeMonitoringComponentProps {
  eventId?: string;
}

const RealTimeMonitoringComponent: React.FC<RealTimeMonitoringComponentProps> = ({ 
  eventId 
}) => {
  const { metrics, isLoading, error } = useRealTimeAnalytics(eventId);

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'bg-green-500';
    if (value >= threshold * 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading real-time data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error loading real-time data: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-pulse text-blue-500" />
            Real-Time System Monitoring
          </CardTitle>
          <CardDescription>
            Live metrics and system performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Active Users */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.activeUsers, 50)}`} />
              </div>
              <div className="text-2xl font-bold">{formatNumber(metrics.activeUsers)}</div>
              <p className="text-xs text-muted-foreground">Users active in last hour</p>
            </div>

            {/* Page Views */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Page Views</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.pageViews, 100)}`} />
              </div>
              <div className="text-2xl font-bold">{formatNumber(metrics.pageViews)}</div>
              <p className="text-xs text-muted-foreground">Views in last 24 hours</p>
            </div>

            {/* Conversions */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Conversions</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.conversions, 10)}`} />
              </div>
              <div className="text-2xl font-bold">{formatNumber(metrics.conversions)}</div>
              <p className="text-xs text-muted-foreground">Conversions today</p>
            </div>

            {/* Revenue */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.revenue, 1000)}`} />
              </div>
              <div className="text-2xl font-bold">${formatNumber(metrics.revenue)}</div>
              <p className="text-xs text-muted-foreground">Revenue today</p>
            </div>

            {/* Event Count */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Total Events</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.eventCount, 200)}`} />
              </div>
              <div className="text-2xl font-bold">{formatNumber(metrics.eventCount)}</div>
              <p className="text-xs text-muted-foreground">Events tracked today</p>
            </div>

            {/* User Engagement */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">User Engagement</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics.userEngagement, 5)}`} />
              </div>
              <div className="text-2xl font-bold">{metrics.userEngagement.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Events per active user</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics Processing</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Updates</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time</span>
              <Badge variant="outline">
                {metrics.activeUsers > 0 ? '<200ms' : 'N/A'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoringComponent;
