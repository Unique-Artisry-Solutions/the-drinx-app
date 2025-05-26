
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

interface RealTimeDashboardProps {
  eventId?: string;
  showEventSpecific?: boolean;
}

const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({ 
  eventId, 
  showEventSpecific = false 
}) => {
  const { 
    metrics, 
    timeFrameData, 
    eventAnalytics, 
    isLoading, 
    error, 
    refresh 
  } = useRealTimeAnalytics(eventId);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case 'active users':
        return Users;
      case 'page views':
        return Eye;
      case 'conversions':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendBadgeColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading real-time data: {error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
          <h2 className="text-xl font-semibold">Real-Time Analytics</h2>
          <Badge variant="outline" className="text-green-600">
            Live
          </Badge>
        </div>
        <Button onClick={refresh} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{formatNumber(metrics.activeUsers)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(metrics.pageViews)}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{formatNumber(metrics.conversions)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${formatNumber(metrics.revenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            Comparing last 7 days to previous period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {timeFrameData.map((metric, index) => {
              const Icon = getMetricIcon(metric.label);
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{metric.label}</p>
                      <p className="text-2xl font-bold">{formatNumber(metric.value)}</p>
                    </div>
                  </div>
                  <Badge className={getTrendBadgeColor(metric.trend)}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event-Specific Analytics */}
      {showEventSpecific && eventId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Analytics
            </CardTitle>
            <CardDescription>
              Real-time metrics for this specific event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold text-blue-600">
                  {eventAnalytics.totalAttendees}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold text-green-600">
                  {eventAnalytics.checkedInAttendees}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${eventAnalytics.revenue.toFixed(0)}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {eventAnalytics.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Real-time system health and connectivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connection</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Updates</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics Processing</span>
              <Badge className="bg-green-100 text-green-800">Running</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDashboard;
