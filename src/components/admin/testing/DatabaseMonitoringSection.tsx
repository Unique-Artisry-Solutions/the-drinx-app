
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle, Database, Gauge } from 'lucide-react';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Progress } from "@/components/ui/progress";

interface HealthMetrics {
  status: 'healthy' | 'degraded' | 'error';
  response_time_ms: number;
  transaction_count: number;
  error_count: number;
  details: {
    database_size_mb: number;
    idle_transactions: number;
    seconds_since_vacuum: number;
    dead_tuples_percent: number;
    cache_hit_rate: number;
    collected_at: string;
  };
}

const DatabaseMonitoringSection = () => {
  const { data: healthMetrics, isLoading: healthLoading } = useQuery({
    queryKey: ['dbHealth'],
    queryFn: async () => {
      // This would be replaced with actual API call to fetch from reward_system_health
      const mockData: HealthMetrics = {
        status: 'healthy',
        response_time_ms: 45,
        transaction_count: 1250,
        error_count: 0,
        details: {
          database_size_mb: 256,
          idle_transactions: 2,
          seconds_since_vacuum: 3600,
          dead_tuples_percent: 5.2,
          cache_hit_rate: 95.8,
          collected_at: new Date().toISOString()
        }
      };
      return mockData;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: performanceMetrics } = useQuery({
    queryKey: ['dbPerformance'],
    queryFn: async () => {
      // This would be replaced with actual API call to fetch from reward_performance_metrics
      return {
        slow_queries: 2,
        avg_response_time: 45,
        cache_efficiency: 95.8
      };
    },
    refetchInterval: 30000
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex items-center justify-center h-24">
              <Activity className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : healthMetrics ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className={`text-2xl font-bold ${getStatusColor(healthMetrics.status)}`}>
                    {healthMetrics.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-2xl font-bold">{healthMetrics.response_time_ms}ms</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Active Transactions</p>
                  <p className="text-2xl font-bold">{healthMetrics.transaction_count}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Cache Hit Rate</span>
                    <span className="text-sm font-medium">
                      {healthMetrics.details.cache_hit_rate}%
                    </span>
                  </div>
                  <Progress 
                    value={healthMetrics.details.cache_hit_rate} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Database Size</span>
                    <span className="text-sm font-medium">
                      {healthMetrics.details.database_size_mb}MB
                    </span>
                  </div>
                </div>
              </div>

              {healthMetrics.error_count > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Alert</AlertTitle>
                  <AlertDescription>
                    {healthMetrics.error_count} errors detected in the last monitoring period
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Unable to fetch health metrics</AlertTitle>
              <AlertDescription>
                Please try again later or contact system administrator
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-600">Slow Queries</p>
                <p className="text-2xl font-bold mt-1">{performanceMetrics.slow_queries}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold mt-1">{performanceMetrics.avg_response_time}ms</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm font-medium text-slate-600">Cache Efficiency</p>
                <p className="text-2xl font-bold mt-1">{performanceMetrics.cache_efficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseMonitoringSection;
