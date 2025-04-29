
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Activity, FileBarChart2, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalyticsExport } from '@/hooks/useAnalyticsExport';

import RewardMetrics from '@/components/analytics/rewards/RewardMetrics';
import RewardTrends from '@/components/analytics/rewards/RewardTrends';
import RealTimeMonitoringComponent from './RealTimeMonitoringComponent';
import TrendAnalysisComponent from './TrendAnalysisComponent';
import ReportBuilderComponent from './ReportBuilderComponent';
import { ProgramStatisticsDashboard } from '../rewards/analytics/ProgramStatisticsDashboard';

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const { exportAnalytics, isExporting } = useAnalyticsExport();
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = async () => {
    try {
      // Prepare sample data for export
      const data = {
        activeUsers: 124,
        newUsers: 28,
        totalSessions: 342,
        avgSessionDuration: '4m 12s',
        bounceRate: '24%',
        exportDate: new Date().toISOString()
      };
      
      await exportAnalytics(data, 'analytics_dashboard');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the analytics data.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button onClick={handleExport} disabled={isExporting} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </div>
      
      {/* Key metrics at the top */}
      <RewardMetrics />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
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
            Rewards Program
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Real-time monitoring tab content */}
        <TabsContent value="realtime">
          <RealTimeMonitoringComponent />
        </TabsContent>
        
        {/* Trend analysis tab content */}
        <TabsContent value="trends">
          <TrendAnalysisComponent />
        </TabsContent>
        
        {/* Report builder tab content */}
        <TabsContent value="reports">
          <ReportBuilderComponent />
        </TabsContent>
        
        {/* Rewards program tab content */}
        <TabsContent value="rewards">
          <ProgramStatisticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
