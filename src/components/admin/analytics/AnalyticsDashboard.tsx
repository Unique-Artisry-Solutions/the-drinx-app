
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Activity, FileBarChart2, TrendingUp, FileText, LineChart, PieChart, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

import RewardMetrics from '@/components/analytics/rewards/RewardMetrics';
import RewardTrends from '@/components/analytics/rewards/RewardTrends';
import RealTimeMonitoringComponent from './RealTimeMonitoringComponent';
import TrendAnalysisComponent from './TrendAnalysisComponent';
import ReportBuilderComponent from './ReportBuilderComponent';
import { ProgramStatisticsDashboard } from '../rewards/analytics/ProgramStatisticsDashboard';
import { EnhancedRewardAnalytics } from '../rewards/analytics/EnhancedRewardAnalytics';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const { exportAnalytics, isExporting } = useAnalyticsExport();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    metrics,
    timeFrameData,
    chartData,
    eventAnalytics,
    isLoading,
    error,
    refresh
  } = useRealTimeAnalytics();

  const handleExport = async () => {
    try {
      const exportData = {
        realTimeMetrics: metrics,
        timeFrameData,
        chartData,
        eventAnalytics,
        exportTimestamp: new Date().toISOString()
      };
      
      await exportAnalytics(exportData, 'analytics_dashboard_real_data');
      
      toast({
        title: 'Export Successful',
        description: 'Analytics data has been exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the analytics data.',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    toast({
      title: 'Analytics Error',
      description: error,
      variant: 'destructive',
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button 
            onClick={refresh} 
            disabled={isLoading} 
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={isExporting || isLoading} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      {/* Real-time metrics overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          title="Active Users"
          value={metrics.activeUsers.toString()}
          icon={Activity}
          iconColor="text-blue-500"
          change={timeFrameData.find(d => d.label === 'Total Events')?.change || 0}
        />
        <AnalyticsMetricCard
          title="Page Views"
          value={metrics.pageViews.toString()}
          icon={LineChart}
          iconColor="text-green-500"
          change={timeFrameData.find(d => d.label === 'Page Views')?.change || 0}
        />
        <AnalyticsMetricCard
          title="Conversions"
          value={metrics.conversions.toString()}
          icon={TrendingUp}
          iconColor="text-purple-500"
          change={timeFrameData.find(d => d.label === 'Conversions')?.change || 0}
        />
        <AnalyticsMetricCard
          title="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          icon={FileBarChart2}
          iconColor="text-orange-500"
          change={eventAnalytics.revenue > 0 ? 5.2 : 0}
        />
      </div>

      {/* Event-specific metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetricCard
          title="Total Attendees"
          value={eventAnalytics.totalAttendees.toString()}
          icon={Activity}
          iconColor="text-indigo-500"
        />
        <AnalyticsMetricCard
          title="Checked In"
          value={eventAnalytics.checkedInAttendees.toString()}
          icon={Activity}
          iconColor="text-emerald-500"
        />
        <AnalyticsMetricCard
          title="Event Revenue"
          value={`$${eventAnalytics.revenue.toLocaleString()}`}
          icon={FileBarChart2}
          iconColor="text-amber-500"
        />
        <AnalyticsMetricCard
          title="Conversion Rate"
          value={`${eventAnalytics.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-rose-500"
        />
      </div>
      
      {/* Key metrics at the top */}
      <RewardMetrics />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Report Builder
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-1">
            <FileBarChart2 className="h-4 w-4" />
            Rewards Basic
          </TabsTrigger>
          <TabsTrigger value="enhanced" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            Enhanced Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Overview tab content */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Key performance indicators for the entire platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RewardTrends />
                
                {/* Real-time chart data */}
                {chartData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
                    <div className="h-64 w-full">
                      {/* Chart would be rendered here using recharts or similar */}
                      <div className="bg-gray-50 h-full rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">
                          Chart with {chartData.length} data points
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Real-time monitoring tab content */}
        <TabsContent value="realtime">
          <RealTimeMonitoringComponent realTimeData={metrics} />
        </TabsContent>
        
        {/* Trend analysis tab content */}
        <TabsContent value="trends">
          <TrendAnalysisComponent timeFrameData={timeFrameData} chartData={chartData} />
        </TabsContent>
        
        {/* Report builder tab content */}
        <TabsContent value="reports">
          <ReportBuilderComponent analyticsData={{ metrics, timeFrameData, chartData, eventAnalytics }} />
        </TabsContent>
        
        {/* Rewards program tab content */}
        <TabsContent value="rewards">
          <ProgramStatisticsDashboard />
        </TabsContent>
        
        {/* Enhanced Analytics tab content */}
        <TabsContent value="enhanced">
          <EnhancedRewardAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
