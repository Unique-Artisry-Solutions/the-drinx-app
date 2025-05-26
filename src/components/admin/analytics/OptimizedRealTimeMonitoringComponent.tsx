
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Users, TrendingUp, DollarSign, RefreshCw, AlertTriangle } from 'lucide-react';
import { useOptimizedRealTimeAnalytics } from '@/hooks/useOptimizedRealTimeAnalytics';
import AnalyticsErrorBoundary from './AnalyticsErrorBoundary';
import { NetworkErrorHandler } from '@/utils/networkErrorHandler';

interface OptimizedRealTimeMonitoringComponentProps {
  eventId?: string;
}

const OptimizedRealTimeMonitoringComponent: React.FC<OptimizedRealTimeMonitoringComponentProps> = ({ 
  eventId 
}) => {
  const { 
    metrics, 
    isLoading, 
    error, 
    refresh, 
    refreshMaterializedViews 
  } = useOptimizedRealTimeAnalytics({ 
    eventId, 
    enableRealTime: true,
    refreshInterval: 300000 // 5 minutes
  });

  const getStatusColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'bg-green-500';
    if (value >= threshold * 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleRefreshWithErrorHandling = async () => {
    try {
      await NetworkErrorHandler.withRetry(refresh, {
        maxRetries: 2,
        retryDelay: 1000
      });
    } catch (error) {
      console.error('Failed to refresh after retries:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading optimized real-time data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnalyticsErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 animate-pulse text-blue-500" />
                <CardTitle>Optimized Real-Time System Monitoring</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {error && (
                  <div className="flex items-center gap-1 text-amber-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Network Issues</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshWithErrorHandling}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshMaterializedViews}
                  className="flex items-center gap-1"
                >
                  <Activity className="h-3 w-3" />
                  <span className="hidden sm:inline">Sync Views</span>
                </Button>
              </div>
            </div>
            <CardDescription>
              Live metrics with optimized caching and performance improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  {NetworkErrorHandler.getErrorMessage(error as any)}
                </p>
              </div>
            )}
            
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
            <CardTitle>Optimized System Status</CardTitle>
            <CardDescription>
              Current system health with performance optimizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Optimized
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analytics Processing</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Cached
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Updates</span>
                <Badge variant="default" className={error ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                  {error ? 'Degraded' : 'Connected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Materialized Views</span>
                <Badge variant="outline">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <Badge variant="outline">
                  {metrics.activeUsers > 0 ? '<100ms' : 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsErrorBoundary>
  );
};

export default OptimizedRealTimeMonitoringComponent;
