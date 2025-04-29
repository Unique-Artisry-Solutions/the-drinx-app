
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data for the trend analysis
const trendData = {
  daily: [
    { name: 'Mon', value: 420, previous: 380 },
    { name: 'Tue', value: 450, previous: 410 },
    { name: 'Wed', value: 520, previous: 430 },
    { name: 'Thu', value: 490, previous: 450 },
    { name: 'Fri', value: 580, previous: 510 },
    { name: 'Sat', value: 670, previous: 590 },
    { name: 'Sun', value: 590, previous: 520 },
  ],
  weekly: [
    { name: 'Week 1', value: 3200, previous: 2800 },
    { name: 'Week 2', value: 3500, previous: 3100 },
    { name: 'Week 3', value: 3800, previous: 3400 },
    { name: 'Week 4', value: 4200, previous: 3600 },
  ],
  monthly: [
    { name: 'Jan', value: 14500, previous: 12200 },
    { name: 'Feb', value: 15800, previous: 13500 },
    { name: 'Mar', value: 16700, previous: 14800 },
    { name: 'Apr', value: 18200, previous: 16000 },
    { name: 'May', value: 19500, previous: 17200 },
    { name: 'Jun', value: 21000, previous: 18500 },
  ],
};

type PeriodType = 'daily' | 'weekly' | 'monthly';
type MetricType = 'points_earned' | 'points_redeemed' | 'active_users' | 'redemption_rate';

interface MetricOption {
  label: string;
  value: MetricType;
  color: string;
  previousColor: string;
}

const metricOptions: MetricOption[] = [
  { label: 'Points Earned', value: 'points_earned', color: '#8884d8', previousColor: '#bfbdee' },
  { label: 'Points Redeemed', value: 'points_redeemed', color: '#82ca9d', previousColor: '#c4e6d4' },
  { label: 'Active Users', value: 'active_users', color: '#ffc658', previousColor: '#ffe2a8' },
  { label: 'Redemption Rate', value: 'redemption_rate', color: '#ff8042', previousColor: '#ffbda1' },
];

const TrendAnalysisComponent = () => {
  const [period, setPeriod] = useState<PeriodType>('weekly');
  const [metric, setMetric] = useState<MetricType>('points_earned');
  const [showComparison, setShowComparison] = useState(true);
  
  const selectedMetric = metricOptions.find(m => m.value === metric) || metricOptions[0];
  
  // Format the chart data based on the selected metric and period
  const chartData = trendData[period].map(item => ({
    name: item.name,
    current: item.value,
    previous: item.previous,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trend Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={metric} onValueChange={(value) => setMetric(value as MetricType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={period} value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value={period}>
            <AnalyticsLineChart
              title=""
              description={`${selectedMetric.label} trends over ${period} periods`}
              data={chartData}
              series={[
                { key: 'current', name: 'Current', color: selectedMetric.color },
                ...(showComparison ? [{ key: 'previous', name: 'Previous Period', color: selectedMetric.previousColor }] : []),
              ]}
              height={350}
            />
            
            <div className="mt-4 text-sm">
              <h4 className="font-medium mb-2">Analysis:</h4>
              <p>Based on the trend data, {selectedMetric.label.toLowerCase()} shows a consistent growth pattern over the last few periods.</p>
              <p className="mt-2">The current period demonstrates a 
                <span className="font-medium text-green-500"> +12.4% increase</span> compared to the previous period, 
                indicating positive performance in this metric.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisComponent;
