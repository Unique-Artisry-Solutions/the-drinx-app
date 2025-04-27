
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Zap, CircleCheck } from "lucide-react";
import { RewardsSystemMonitor, PerformanceTestResult } from '@/lib/rewards/system/RewardsSystemMonitor';
import { useQuery } from '@tanstack/react-query';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { toast } from 'sonner';

const SystemOverviewTab = () => {
  const { data: healthMetrics, isLoading: healthLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: RewardsSystemMonitor.getSystemHealth,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: performanceTest, isLoading: testLoading, error: testError, refetch: refetchTests } = useQuery({
    queryKey: ['performanceTest'],
    queryFn: RewardsSystemMonitor.runPerformanceTests,
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

  const handleRefreshTests = () => {
    toast.info("Refreshing performance tests...");
    refetchTests();
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'fast':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'average':
        return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'slow':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <p>Loading...</p>
            ) : healthMetrics ? (
              <div>
                <h3 className={`text-2xl font-bold ${getStatusColor(healthMetrics.status)}`}>
                  {healthMetrics.status.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Response Time: {healthMetrics.response_time_ms}ms
                </p>
                <p className="text-sm text-gray-500">
                  Transactions: {healthMetrics.transaction_count}
                </p>
                <p className="text-sm text-gray-500">
                  Errors: {healthMetrics.error_count}
                </p>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Unable to fetch system health metrics
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <AnalyticsMetricCard 
          title="Active Users"
          value="1,245"
          icon={TrendingUp}
          iconColor="text-blue-500"
          change={12.5}
        />

        <AnalyticsMetricCard 
          title="Transaction Success Rate" 
          value="99.2%"
          icon={CircleCheck}
          iconColor="text-green-500"
          change={0.8}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Tests</CardTitle>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            onClick={handleRefreshTests}
          >
            <Activity className="h-4 w-4" />
            Run Tests
          </button>
        </CardHeader>
        <CardContent>
          {testLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex flex-col items-center gap-2">
                <Activity className="h-6 w-6 animate-pulse text-blue-500" />
                <p className="text-sm text-muted-foreground">Running performance tests...</p>
              </div>
            </div>
          ) : testError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Test Failed</AlertTitle>
              <AlertDescription>
                Unable to run performance tests. Please try again later.
              </AlertDescription>
            </Alert>
          ) : !performanceTest ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>
                No test results available. Click "Run Tests" to get the latest performance metrics.
              </AlertDescription>
            </Alert>
          ) : Object.keys(performanceTest).length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No tests to display</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
              {Object.entries(performanceTest).map(([testName, result]) => (
                <div key={testName} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getTestStatusIcon(result.status)}
                    <h3 className="font-medium text-sm">{testName}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono">
                      {typeof result.duration_ms === 'number' ? `${result.duration_ms}ms` : 'N/A'}
                    </span>
                    {typeof result.duration_ms === 'number' && (
                      <span className={
                        result.status === 'fast' ? "text-green-500" : 
                        result.status === 'average' ? "text-yellow-500" : 
                        result.status === 'slow' ? "text-red-500" : "text-gray-500"
                      }>
                        {result.status === 'fast' ? "Fast" : result.status === 'average' ? "Average" : result.status === 'slow' ? "Slow" : "Error"}
                      </span>
                    )}
                  </div>
                  {result.rows_processed && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Rows processed: {result.rows_processed}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverviewTab;
