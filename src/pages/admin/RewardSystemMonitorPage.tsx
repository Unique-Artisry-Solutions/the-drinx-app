
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { RewardsSystemMonitor } from '@/lib/rewards/system/RewardsSystemMonitor';
import { RewardsCache } from '@/lib/rewards/system/RewardsCache';

const RewardSystemMonitorPage = () => {
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
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Reward System Monitor</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="cache">Cache Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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

            {/* Performance Test Results */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Tests</CardTitle>
                <CardDescription>Latest test results</CardDescription>
              </CardHeader>
              <CardContent>
                {testLoading ? (
                  <p>Running tests...</p>
                ) : performanceTest ? (
                  <div className="space-y-2">
                    {Object.entries(performanceTest).map(([test, result]) => (
                      <div key={test} className="flex items-center justify-between">
                        <span className="text-sm">{test}</span>
                        <span className="text-sm font-mono">
                          {typeof result === 'number' ? `${result}ms` : JSON.stringify(result)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No test results available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed system performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add performance metrics visualization here */}
              <p>Performance metrics visualization coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <CardTitle>Cache Management</CardTitle>
              <CardDescription>
                Monitor and manage system cache
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add cache management interface here */}
              <p>Cache management interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardSystemMonitorPage;
