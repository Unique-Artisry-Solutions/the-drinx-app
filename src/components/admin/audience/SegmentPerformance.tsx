
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react';
import { AudienceSegment, AudienceSegmentAnalytics } from '@/types/AudienceTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { format, subDays, subMonths, differenceInDays } from 'date-fns';

interface SegmentPerformanceProps {
  segments: AudienceSegment[];
  analyticsData?: AudienceSegmentAnalytics[];
  isLoading?: boolean;
}

export const SegmentPerformance: React.FC<SegmentPerformanceProps> = ({
  segments,
  analyticsData,
  isLoading
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Generate sample data for demonstration purposes
  // In a real app, this would come from the analyticsData prop
  const generateSampleData = () => {
    const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
    const interval = timeframe === 'week' ? 1 : timeframe === 'month' ? 3 : 10;
    
    return {
      membershipData: Array.from({ length: Math.ceil(days/interval) }, (_, i) => ({
        name: format(subDays(new Date(), days - (i * interval)), 'MMM d'),
        members: Math.floor(Math.random() * 100) + 400 + (i * 10),
      })),
      
      segmentComparisonData: segments.slice(0, 5).map(segment => ({
        name: segment.name,
        members: segment.memberCount || Math.floor(Math.random() * 500) + 100,
        growth: Math.floor(Math.random() * 20) - 5,
      })),
      
      conversionData: Array.from({ length: Math.ceil(days/interval) }, (_, i) => ({
        name: format(subDays(new Date(), days - (i * interval)), 'MMM d'),
        rate: Math.random() * 10 + 2,
      })),
      
      engagementData: Array.from({ length: Math.ceil(days/interval) }, (_, i) => ({
        name: format(subDays(new Date(), days - (i * interval)), 'MMM d'),
        score: Math.random() * 40 + 30,
      }))
    };
  };
  
  const { 
    membershipData, 
    segmentComparisonData, 
    conversionData, 
    engagementData 
  } = generateSampleData();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Performance</CardTitle>
          <CardDescription>Loading performance metrics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (segments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Performance</CardTitle>
          <CardDescription>No segments available for analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80 text-center">
          <div>
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-medium">No data to display</p>
            <p className="text-sm text-muted-foreground">
              Create segments to see performance metrics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Segment Performance</CardTitle>
          <CardDescription>
            Analyze and compare audience segment metrics
          </CardDescription>
        </div>
        <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="growth">
          <TabsList className="mb-4">
            <TabsTrigger value="growth">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <LineChart className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="growth">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsLineChart 
                title="Segment Membership Growth"
                description={`Growth trend over the last ${timeframe === 'week' ? '7' : timeframe === 'month' ? '30' : '90'} days`}
                data={membershipData}
                series={[
                  { key: "members", name: "Members", color: "#8B5CF6" }
                ]}
                height={350}
              />
              <AnalyticsLineChart 
                title="Conversion Rate"
                description="Percentage of users converting to the desired action"
                data={conversionData}
                series={[
                  { key: "rate", name: "Conversion %", color: "#10B981" }
                ]}
                height={350}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Rate']}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="grid grid-cols-1 gap-6">
              <AnalyticsBarChart 
                title="Segment Size Comparison"
                description="Member count across top segments"
                data={segmentComparisonData}
                series={[
                  { key: "members", name: "Members", color: "#8B5CF6" }
                ]}
                height={400}
              />
              <AnalyticsBarChart 
                title="Growth Rate Comparison"
                description="Percentage growth across segments"
                data={segmentComparisonData}
                series={[
                  { key: "growth", name: "Growth %", color: "#10B981" }
                ]}
                height={300}
                formatter={(value) => [`${value}%`, 'Growth']}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 gap-6">
              <AnalyticsLineChart 
                title="Engagement Score"
                description="User engagement metrics over time"
                data={engagementData}
                series={[
                  { key: "score", name: "Engagement Score", color: "#F59E0B" }
                ]}
                height={400}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
