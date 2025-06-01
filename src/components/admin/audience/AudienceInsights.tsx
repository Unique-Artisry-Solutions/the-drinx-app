
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Activity, UserCheck } from 'lucide-react';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { calculateSegmentMembership, fetchSegmentAnalytics } from '@/services/audienceService';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AudienceInsights: React.FC<{ segmentId?: string }> = ({ segmentId }) => {
  const { segments, useSegmentDetails, useSegmentAnalytics } = useAudienceSegments();
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  const { toast } = useToast();
  
  // Get segment details if a specific segment is selected
  const { 
    data: segmentData,
    isLoading: isLoadingSegment 
  } = useSegmentDetails(segmentId);
  
  // Get analytics data for the selected segment
  const startDate = format(
    subDays(new Date(), timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90),
    'yyyy-MM-dd'
  );
  
  const { 
    data: analyticsData = [],
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics
  } = useSegmentAnalytics(segmentId, startDate);
  
  // Process analytics data for charts
  const membershipData = analyticsData.map(item => ({
    name: format(new Date(item.date), 'MMM d'),
    members: item.total_members,
    growth: item.total_members * (Math.random() * 0.3 + 0.7) // Simulated previous period for growth calculation
  }));
  
  // Calculate growth metrics
  const currentMembers = segmentData?.segment.memberCount || 0;
  const growthRate = membershipData.length > 1 
    ? ((membershipData[membershipData.length - 1]?.members || 0) - 
       (membershipData[0]?.members || 0)) / (membershipData[0]?.members || 1) * 100
    : 0;
  
  // Sample engagement metrics (would be real in production)
  const engagementRate = 42.8;
  const conversionRate = 6.3;
  
  // Sample audience distribution data (would be from API in production)
  const demographicsData = [
    { name: '18-24', value: 22 },
    { name: '25-34', value: 38 },
    { name: '35-44', value: 20 },
    { name: '45-54', value: 12 },
    { name: '55+', value: 8 }
  ];
  
  const handleRefreshData = async () => {
    if (!segmentId) return;
    
    try {
      toast({
        title: "Refreshing segment data",
        description: "Recalculating segment membership...",
      });
      
      const memberCount = await calculateSegmentMembership(segmentId);
      
      toast({
        title: "Segment refreshed",
        description: `Updated with ${memberCount} members.`,
      });
      
      refetchAnalytics();
    } catch (error) {
      toast({
        title: "Error refreshing segment data",
        description: "An error occurred while updating the segment.",
        variant: "destructive"
      });
    }
  };
  
  if (!segmentId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>
            Select a segment to view detailed analytics and insights
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center space-y-2">
            <Users className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">No segment selected</p>
            <p className="text-sm text-muted-foreground">Choose a segment from the list to see detailed metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoadingSegment || isLoadingAnalytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Insights</CardTitle>
          <CardDescription>
            Preparing audience analytics data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{segmentData?.segment.name} Insights</CardTitle>
          <CardDescription>
            Analytical data and performance metrics for this audience segment
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <TabsList>
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" onClick={handleRefreshData}>Refresh Data</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsMetricCard 
            title="Total Members" 
            value={currentMembers.toLocaleString()}
            icon={Users}
            iconColor="text-blue-500"
            change={growthRate}
          />
          <AnalyticsMetricCard 
            title="Growth Rate" 
            value={`${Math.abs(growthRate).toFixed(1)}%`}
            icon={TrendingUp}
            iconColor={growthRate >= 0 ? "text-green-500" : "text-red-500"}
            change={growthRate >= 0 ? growthRate : -growthRate}
          />
          <AnalyticsMetricCard 
            title="Engagement Rate" 
            value={`${engagementRate}%`}
            icon={Activity}
            iconColor="text-purple-500"
            change={3.2}
          />
          <AnalyticsMetricCard 
            title="Conversion Rate" 
            value={`${conversionRate}%`}
            icon={UserCheck}
            iconColor="text-amber-500"
            change={1.5}
          />
        </div>
        
        {/* Charts section */}
        <Tabs defaultValue="membership">
          <TabsList>
            <TabsTrigger value="membership">Membership Trends</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="membership">
            <div className="grid grid-cols-1 gap-6">
              <AnalyticsLineChart 
                title="Membership Growth"
                description="Number of users in the segment over time"
                data={membershipData}
                series={[
                  { key: "members", name: "Total Members", color: "#8B5CF6" }
                ]}
                height={350}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="demographics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsPieChart 
                title="Age Distribution"
                description="Breakdown of segment members by age group"
                data={demographicsData}
                colors={['#8B5CF6', '#6366F1', '#4F46E5', '#4338CA', '#3730A3']}
              />
              <AnalyticsBarChart 
                title="Location Breakdown"
                description="Geographic distribution of segment members"
                data={[
                  { name: "New York", users: 420 },
                  { name: "Los Angeles", users: 380 },
                  { name: "Chicago", users: 290 },
                  { name: "Houston", users: 240 },
                  { name: "Phoenix", users: 190 }
                ]}
                series={[
                  { key: "users", name: "Users", color: "#8B5CF6" }
                ]}
                height={300}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="behavior">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnalyticsBarChart 
                title="Top Activities"
                description="Most common user activities in this segment"
                data={[
                  { name: "Visited Profile", count: 86 },
                  { name: "Viewed Menu", count: 72 },
                  { name: "Checked In", count: 58 },
                  { name: "Left Review", count: 32 },
                  { name: "Joined Event", count: 24 }
                ]}
                series={[
                  { key: "count", name: "Activity Count", color: "#8B5CF6" }
                ]}
                height={300}
              />
              <AnalyticsLineChart 
                title="Engagement Over Time"
                description="User engagement patterns"
                data={Array.from({ length: 14 }, (_, i) => ({
                  name: format(subDays(new Date(), 13 - i), 'MMM d'),
                  engagement: Math.floor(Math.random() * 50) + 30
                }))}
                series={[
                  { key: "engagement", name: "Engagement Score", color: "#8B5CF6" }
                ]}
                height={300}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
