import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AudienceMetric } from '@/services/promoterAnalyticsService';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { safeFormatDate } from '@/utils/dateUtils';

interface AudienceAnalyticsTabProps {
  audienceMetrics: AudienceMetric[];
  subscriberTrend: { date: string; metric_value: number; metric_name: string }[];
  engagementTrend: { date: string; metric_value: number; metric_name: string }[];
  isLoading: boolean;
  onMetricClick?: (metricName: string, segment: string) => void;
}

const AudienceAnalyticsTab: React.FC<AudienceAnalyticsTabProps> = ({
  audienceMetrics,
  subscriberTrend,
  engagementTrend,
  isLoading,
  onMetricClick
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('gender');
  
  // Prepare audience demographic data for the selected metric with safety checks
  const audienceDemographicData = React.useMemo(() => {
    if (!audienceMetrics?.length) return [];
    
    const filteredMetrics = audienceMetrics.filter(metric => 
      metric.metric_name === selectedMetric
    );
    
    return filteredMetrics.map(metric => ({
      name: metric.segment || 'Unknown',
      value: metric.metric_value || 0
    }));
  }, [audienceMetrics, selectedMetric]);
  
  // Format trend data for charts - with enhanced safety checks
  const subscriberTrendData = React.useMemo(() => {
    if (!subscriberTrend?.length) return [];
    
    return subscriberTrend.map(item => ({
      name: safeFormatDate(item.date || '', 'MMM d', 'Unknown'),
      subscribers: item.metric_value || 0
    }));
  }, [subscriberTrend]);
  
  const engagementTrendData = React.useMemo(() => {
    if (!engagementTrend?.length) return [];
    
    return engagementTrend.map(item => ({
      name: safeFormatDate(item.date || '', 'MMM d', 'Unknown'),
      engagement: item.metric_value || 0
    }));
  }, [engagementTrend]);
  
  // Calculate retention metrics with safety checks
  const retentionData = React.useMemo(() => {
    // Verify we have enough data to calculate retention
    if (!subscriberTrend || subscriberTrend.length < 7) {
      return [];
    }
    
    try {
      // Sort dates for accurate calculations
      const trend = [...subscriberTrend]
        .sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .filter(item => item.date && !isNaN(new Date(item.date).getTime()));
      
      if (trend.length < 7) return []; // Still need at least 7 days of valid data
      
      const weeklyRetention = [];
      for (let i = 7; i < trend.length; i += 7) {
        const currentValue = trend[i].metric_value || 0;
        const previousValue = trend[i-7].metric_value || 1; // Prevent division by zero
        const retention = previousValue > 0 ? (currentValue / previousValue) * 100 : 100;
        
        weeklyRetention.push({
          name: `Week ${Math.floor(i/7)}`,
          retention: Math.min(Math.round(retention), 100)
        });
      }
      
      return weeklyRetention;
    } catch (error) {
      console.error("Error calculating retention data:", error);
      return [];
    }
  }, [subscriberTrend]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }
  
  if (!audienceMetrics || audienceMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">No audience data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audience Analytics</h3>
        <Select 
          value={selectedMetric} 
          onValueChange={setSelectedMetric}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gender">Gender Distribution</SelectItem>
            <SelectItem value="location">Location Distribution</SelectItem>
            <SelectItem value="interests">Audience Interests</SelectItem>
            <SelectItem value="age">Age Demographics</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Demographic Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demographic Distribution</CardTitle>
            <CardDescription>
              Breakdown of audience by {selectedMetric}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {audienceDemographicData.length > 0 ? (
              <AnalyticsPieChart
                title=""
                description=""
                data={audienceDemographicData}
                colors={['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']}
                onSliceClick={(entry) => {
                  if (onMetricClick && entry.name) {
                    onMetricClick(selectedMetric, entry.name);
                  }
                }}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">No demographic data available</p>
            )}
          </CardContent>
        </Card>
      
        {/* Audience Growth Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Audience Growth</CardTitle>
            <CardDescription>
              Subscriber growth trend over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscriberTrendData.length > 0 ? (
              <AnalyticsLineChart
                title=""
                description=""
                data={subscriberTrendData}
                series={[
                  {
                    key: "subscribers",
                    name: "Subscribers",
                    color: "#8B5CF6"
                  }
                ]}
                formatter={(value) => [`${value}`, 'subscribers']}
                height={260}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">No subscriber trend data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>
            Audience engagement trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {engagementTrendData.length > 0 ? (
            <AnalyticsLineChart
              title=""
              description=""
              data={engagementTrendData}
              series={[
                {
                  key: "engagement",
                  name: "Engagement Rate %",
                  color: "#06B6D4"
                }
              ]}
              formatter={(value) => [`${value}%`, 'engagement']}
              height={300}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No engagement data available</p>
          )}
        </CardContent>
      </Card>
      
      {/* Audience Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Retention</CardTitle>
          <CardDescription>
            Weekly audience retention rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {retentionData.length > 0 ? (
            <AnalyticsBarChart
              title=""
              description=""
              data={retentionData}
              series={[
                {
                  key: "retention",
                  name: "Retention Rate %",
                  color: "#10B981"
                }
              ]}
              formatter={(value) => [`${value}%`, 'retention']}
              height={300}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Insufficient data to calculate retention metrics
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Audience Interests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Interests</CardTitle>
          <CardDescription>
            Top interests and preferences of your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audienceMetrics.map((metric, index) => (
                <TableRow 
                  key={`${metric.metric_name || 'unknown'}-${index}`}
                  onClick={() => {
                    if (onMetricClick && metric.metric_name) {
                      onMetricClick(metric.metric_name, metric.segment || 'Unknown');
                    }
                  }}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{metric.metric_name || 'Unknown'}</TableCell>
                  <TableCell>{metric.segment || 'Unknown'}</TableCell>
                  <TableCell>{metric.metric_value || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceAnalyticsTab;
