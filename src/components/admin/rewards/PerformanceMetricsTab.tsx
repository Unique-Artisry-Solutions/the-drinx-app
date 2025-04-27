
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Activity, BarChart, LineChart } from 'lucide-react';
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

const PerformanceMetricsTab = () => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
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
              <LineChart className="h-5 w-5" />
              Latency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Advanced latency metrics coming soon</p>
            </div>
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
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground">Throughput analysis coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetricsTab;
