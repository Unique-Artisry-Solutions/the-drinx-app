
import React from 'react';
import { TrendingUp, CircleCheck } from "lucide-react";
import { RewardsSystemMonitor } from '@/lib/rewards/system/RewardsSystemMonitor';
import { useQuery } from '@tanstack/react-query';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { toast } from 'sonner';
import { SystemHealthCard } from './system-overview/SystemHealthCard';
import { PerformanceTestCard } from './system-overview/PerformanceTestCard';
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';

// Import SystemHealthMetric type directly from the system file to avoid conflicts
import type { SystemHealthMetric } from '@/lib/rewards/system/RewardsSystemMonitor';

const SystemOverviewTab = () => {
  const { exportAnalytics } = useAnalyticsExport();
  
  const { data: healthMetrics, isLoading: healthLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: RewardsSystemMonitor.getSystemHealth,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { 
    data: performanceTests, 
    isLoading: testLoading, 
    error: testError, 
    refetch: refetchTests 
  } = useQuery({
    queryKey: ['performanceTest'],
    queryFn: RewardsSystemMonitor.runPerformanceTests,
  });

  const handleRefreshTests = () => {
    toast.info("Refreshing performance tests...");
    refetchTests();
  };
  
  const handleExportMetrics = () => {
    if (healthMetrics) {
      exportAnalytics({
        healthMetrics,
        performanceTests,
        timestamp: new Date().toISOString(),
      }, 'system_health_metrics');
    } else {
      toast.error("No health metrics available to export");
    }
  };

  // Convert performance test results to array format if needed
  const formattedPerformanceTests = performanceTests 
    ? Array.isArray(performanceTests) 
        ? performanceTests 
        : Object.entries(performanceTests).map(([name, data]) => ({
            name,
            duration_ms: data.duration_ms,
            status: data.status,
          })) 
    : null;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SystemHealthCard 
          healthMetrics={healthMetrics}
          isLoading={healthLoading}
        />

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

      <PerformanceTestCard
        performanceTest={formattedPerformanceTests}
        isLoading={testLoading}
        error={testError}
        onRefresh={handleRefreshTests}
        onExport={handleExportMetrics}
      />
    </div>
  );
};

export default SystemOverviewTab;
