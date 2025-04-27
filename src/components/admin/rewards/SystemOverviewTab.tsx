
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { RewardsSystemMonitor } from '@/lib/rewards/system/RewardsSystemMonitor';
import { useQuery } from '@tanstack/react-query';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

const SystemOverviewTab = () => {
  const { data: healthMetrics, isLoading: healthLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: RewardsSystemMonitor.getSystemHealth,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: performanceTest, isLoading: testLoading } = useQuery({
    queryKey: ['performanceTest'],
    queryFn: RewardsSystemMonitor.runPerformanceTests
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
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          icon={Activity}
          iconColor="text-blue-500"
          change={12.5}
        />

        <AnalyticsMetricCard 
          title="Transaction Success Rate" 
          value="99.2%"
          icon={CheckCircle}
          iconColor="text-green-500"
          change={0.8}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Tests</CardTitle>
        </CardHeader>
        <CardContent>
          {testLoading ? (
            <p>Running tests...</p>
          ) : performanceTest ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(performanceTest).map(([test, result]) => (
                <div key={test} className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">{test.replace(/_/g, ' ')}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono">
                      {typeof result === 'number' ? `${result}ms` : JSON.stringify(result)}
                    </span>
                    {typeof result === 'number' && (
                      <span className={result < 100 ? "text-green-500" : result < 500 ? "text-yellow-500" : "text-red-500"}>
                        {result < 100 ? "Fast" : result < 500 ? "Average" : "Slow"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No test results available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverviewTab;
