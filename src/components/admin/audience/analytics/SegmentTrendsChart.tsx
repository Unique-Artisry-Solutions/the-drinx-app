
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, eachDayOfInterval, subDays } from 'date-fns';

interface SegmentTrendsChartProps {
  dateRange?: DateRange;
  segments: AudienceSegment[];
  isLoading: boolean;
}

export function SegmentTrendsChart({ dateRange, segments, isLoading }: SegmentTrendsChartProps) {
  const [metricType, setMetricType] = useState<'conversion' | 'engagement' | 'growth'>('conversion');
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');
  
  // Generate synthetic data for the chart
  const generateChartData = () => {
    if (!dateRange?.from) return [];
    
    const startDate = dateRange.from;
    const endDate = dateRange.to || new Date();
    
    // Generate data for each day in the range
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const data: any = {
        date: format(day, 'MMM dd'),
        timestamp: day.getTime(),
      };
      
      // Add data for each segment
      segments.forEach(segment => {
        const segmentKey = segment.id.replace(/-/g, '_');
        
        if (metricType === 'conversion') {
          // Conversion rate tends to be somewhat stable with minor fluctuations
          const baseRate = 3 + Math.random() * 7; // 3-10%
          const dayOffset = Math.sin(day.getDate() / 30 * Math.PI) * 2; // Oscillation
          data[segmentKey] = Math.max(0.1, baseRate + dayOffset);
        } 
        else if (metricType === 'engagement') {
          // Engagement tends to spike on certain days
          const baseScore = 30 + Math.random() * 30;
          const isWeekend = [0, 6].includes(day.getDay());
          const weekendBoost = isWeekend ? 15 : 0;
          data[segmentKey] = baseScore + weekendBoost + (Math.random() * 10 - 5);
        }
        else if (metricType === 'growth') {
          // Growth rate - can be positive or negative with a general trend
          const dayIndex = days.indexOf(day);
          const progress = dayIndex / days.length;
          const trend = segment.name.includes('New') ? 5 : -2; // Some segments grow, others shrink
          const baseGrowth = trend + (Math.random() * 6 - 3);
          data[segmentKey] = baseGrowth - (progress * 2); // Generally declining over time
        }
      });
      
      return data;
    });
  };
  
  // Get metric title and format
  const getMetricInfo = () => {
    switch (metricType) {
      case 'conversion':
        return { title: 'Conversion Rate', format: (v: number) => `${v.toFixed(1)}%` };
      case 'engagement':
        return { title: 'Engagement Score', format: (v: number) => v.toFixed(1) };
      case 'growth':
        return { title: 'Growth Rate', format: (v: number) => `${v.toFixed(1)}%` };
      default:
        return { title: 'Value', format: (v: number) => v.toString() };
    }
  };
  
  const chartData = generateChartData();
  const metricInfo = getMetricInfo();
  
  // Generate random colors for segments
  const getSegmentColor = (index: number) => {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', 
      '#d0ed57', '#83a6ed', '#8dd1e1', '#a4262c', '#ca5010'
    ];
    return colors[index % colors.length];
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading segment data...</div>;
  }
  
  if (segments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Select segments to view trend analysis</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'line' | 'bar')}>
            <TabsList>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={metricType} onValueChange={(v) => setMetricType(v as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conversion">Conversion Rate</SelectItem>
              <SelectItem value="engagement">Engagement Score</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="h-[400px]">
            {viewType === 'line' ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [metricInfo.format(value), metricInfo.title]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  {segments.map((segment, index) => (
                    <Line
                      key={segment.id}
                      type="monotone"
                      dataKey={segment.id.replace(/-/g, '_')}
                      name={segment.name}
                      stroke={getSegmentColor(index)}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [metricInfo.format(value), metricInfo.title]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  {segments.map((segment, index) => (
                    <Bar
                      key={segment.id}
                      dataKey={segment.id.replace(/-/g, '_')}
                      name={segment.name}
                      fill={getSegmentColor(index)}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
