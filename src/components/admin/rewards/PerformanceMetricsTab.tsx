import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardMetrics from '@/components/analytics/rewards/RewardMetrics';
import RewardTrends from '@/components/analytics/rewards/RewardTrends';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Activity, BarChart, LineChart, Database, Server, Clock, Gauge } from 'lucide-react';
import {
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
} from '@/components/ui/chart';

// Sample data for demonstration purposes
const responseTimeData = [
  { name: '0:00', value: 45 },
  { name: '2:00', value: 52 },
  { name: '4:00', value: 48 },
  { name: '6:00', value: 91 },
  { name: '8:00', value: 99 },
  { name: '10:00', value: 87 },
  { name: '12:00', value: 85 },
  { name: '14:00', value: 60 },
  { name: '16:00', value: 47 },
  { name: '18:00', value: 58 },
  { name: '20:00', value: 65 },
  { name: '22:00', value: 50 },
];

const transactionData = [
  { name: 'Mon', success: 125, failed: 5 },
  { name: 'Tue', success: 132, failed: 3 },
  { name: 'Wed', success: 146, failed: 4 },
  { name: 'Thu', success: 168, failed: 2 },
  { name: 'Fri', success: 201, failed: 7 },
  { name: 'Sat', success: 276, failed: 8 },
  { name: 'Sun', success: 189, failed: 6 },
];

const resourceUsageData = [
  { name: '0:00', cpu: 25, memory: 45, db: 15 },
  { name: '2:00', cpu: 28, memory: 46, db: 17 },
  { name: '4:00', cpu: 22, memory: 45, db: 16 },
  { name: '6:00', cpu: 18, memory: 42, db: 14 },
  { name: '8:00', cpu: 35, memory: 54, db: 22 },
  { name: '10:00', cpu: 55, memory: 60, db: 35 },
  { name: '12:00', cpu: 68, memory: 65, db: 42 },
  { name: '14:00', cpu: 58, memory: 62, db: 38 },
  { name: '16:00', cpu: 63, memory: 64, db: 40 },
  { name: '18:00', cpu: 52, memory: 58, db: 32 },
  { name: '20:00', cpu: 38, memory: 52, db: 24 },
  { name: '22:00', cpu: 30, memory: 48, db: 18 },
];

// Added data for the new visualizations
const requestLatencyData = [
  { name: 'Points Calculation', min: 15, avg: 42, max: 86 },
  { name: 'Rule Processing', min: 18, avg: 35, max: 62 },
  { name: 'Reward Lookup', min: 8, avg: 22, max: 45 },
  { name: 'Redemption', min: 25, avg: 60, max: 120 },
  { name: 'Balance Check', min: 5, avg: 15, max: 35 },
];

const throughputData = [
  { name: '8:00', transactions: 145 },
  { name: '9:00', transactions: 256 },
  { name: '10:00', transactions: 378 },
  { name: '11:00', transactions: 421 },
  { name: '12:00', transactions: 463 },
  { name: '13:00', transactions: 502 },
  { name: '14:00', transactions: 546 },
  { name: '15:00', transactions: 475 },
  { name: '16:00', transactions: 380 },
  { name: '17:00', transactions: 340 },
];

const PerformanceMetricsTab = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your analytics data is being prepared for download.",
    });
    // Export functionality to be implemented
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <RewardMetrics />
      
      <div className="grid gap-6 grid-cols-1">
        <RewardTrends />
        
        <AnalyticsLineChart
          title="Response Time (ms)"
          description="System response time over the past 24 hours"
          data={responseTimeData}
          series={[
            { key: 'value', name: 'Response Time', color: '#3b82f6' }
          ]}
          formatter={(value) => [`${value}ms`, 'Response Time']}
        />
        
        <AnalyticsBarChart
          title="Transaction Volume"
          description="Daily transaction success and failure counts"
          data={transactionData}
          series={[
            { key: 'success', name: 'Successful', color: '#22c55e' },
            { key: 'failed', name: 'Failed', color: '#ef4444' }
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <AnalyticsLineChart
            title=""
            data={resourceUsageData}
            series={[
              { key: 'cpu', name: 'CPU %', color: '#f59e0b' },
              { key: 'memory', name: 'Memory %', color: '#8b5cf6' },
              { key: 'db', name: 'Database %', color: '#06b6d4' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Latency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AnalyticsBarChart
              title=""
              description=""
              data={requestLatencyData}
              series={[
                { key: 'min', name: 'Min (ms)', color: '#22c55e' },
                { key: 'avg', name: 'Avg (ms)', color: '#f59e0b' },
                { key: 'max', name: 'Max (ms)', color: '#ef4444' }
              ]}
              height={250}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Transaction Throughput
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AnalyticsBarChart
              title=""
              description=""
              data={throughputData}
              series={[
                { key: 'transactions', name: 'Transactions/hour', color: '#3b82f6' }
              ]}
              height={250}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Performance Trends (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <AnalyticsLineChart
            title=""
            data={[
              { name: '1', avg_response: 45, peak_response: 120, transactions: 2500 },
              { name: '5', avg_response: 50, peak_response: 135, transactions: 2700 },
              { name: '10', avg_response: 42, peak_response: 110, transactions: 3100 },
              { name: '15', avg_response: 38, peak_response: 95, transactions: 3300 },
              { name: '20', avg_response: 55, peak_response: 145, transactions: 3200 },
              { name: '25', avg_response: 48, peak_response: 125, transactions: 3400 },
              { name: '30', avg_response: 43, peak_response: 115, transactions: 3500 },
            ]}
            series={[
              { key: 'avg_response', name: 'Avg Response (ms)', color: '#3b82f6' },
              { key: 'peak_response', name: 'Peak Response (ms)', color: '#ef4444' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetricsTab;
