
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/lib/rewards/api';
import { CalendarDays, Users, TrendingUp, Activity, CircleDollarSign, BarChart } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import DateRangeSelector from './components/DateRangeSelector';
import BusinessImpactSection from './components/BusinessImpactSection';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';

export function ExecutiveSummaryTab() {
  // Updated to use from/to instead of start/end to match DateRange type
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    to: new Date()
  });
  
  const [comparisonPeriod, setComparisonPeriod] = useState<'30d' | '90d' | '1yr'>('90d');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['rewardExecutiveSummary', dateRange, comparisonPeriod],
    queryFn: () => rewardsApi.getExecutiveSummary(
      dateRange.from as Date, 
      dateRange.to as Date, 
      comparisonPeriod
    ),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading executive summary data</p>
        </CardContent>
      </Card>
    );
  }

  // Extract metrics from data
  const { 
    programHealth, 
    growthTrends,
    businessImpact 
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Executive Summary</h2>
          <p className="text-muted-foreground">Comprehensive overview of your rewards program performance</p>
        </div>
        <DateRangeSelector 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
      </div>
      
      {/* Program Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Active Members"
          value={programHealth.activeMembers.toLocaleString()}
          icon={Users}
          iconColor="text-blue-500"
          change={programHealth.activeMembersChange}
          backgroundColor="bg-blue-50 dark:bg-blue-950"
        />
        <AnalyticsMetricCard
          title="Points Economy"
          value={programHealth.pointsBalance.toLocaleString()}
          icon={CircleDollarSign}
          iconColor="text-green-500"
          change={programHealth.pointsBalanceChange}
          backgroundColor="bg-green-50 dark:bg-green-950"
        />
        <AnalyticsMetricCard
          title="Growth Rate"
          value={`${programHealth.growthRate.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-purple-500"
          change={programHealth.growthRateChange}
          backgroundColor="bg-purple-50 dark:bg-purple-950"
        />
        <AnalyticsMetricCard
          title="Engagement Rate"
          value={`${programHealth.engagementRate.toFixed(1)}%`}
          icon={Activity}
          iconColor="text-amber-500"
          change={programHealth.engagementRateChange}
          backgroundColor="bg-amber-50 dark:bg-amber-950"
        />
      </div>

      {/* Program Growth Trends */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Program Growth Trends</CardTitle>
          <div className="flex space-x-2">
            <Tabs 
              defaultValue={comparisonPeriod} 
              onValueChange={(value) => setComparisonPeriod(value as any)}
              className="mt-2"
            >
              <TabsList>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
                <TabsTrigger value="90d">90 Days</TabsTrigger>
                <TabsTrigger value="1yr">1 Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsLineChart
              title="Member Enrollment"
              description="New and returning member enrollment over time"
              height={300}
              data={growthTrends.enrollment}
              series={[
                { key: "newMembers", name: "New Members", color: "#8884d8" },
                { key: "returningMembers", name: "Returning Members", color: "#82ca9d" },
              ]}
            />
            <AnalyticsBarChart
              title="Active Member Rate"
              description="Percentage of members active in rewards program"
              height={300}
              data={growthTrends.activeRate}
              series={[
                { key: "activeRate", name: "Active Rate %", color: "#8884d8" },
                { key: "targetRate", name: "Target Rate %", color: "#ff8042" },
              ]}
              formatter={(value) => [`${value}%`, 'Active Rate']}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Impact Metrics */}
      <BusinessImpactSection 
        data={businessImpact} 
        dateRange={dateRange}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Executive Summary</h2>
          <p className="text-muted-foreground">Loading program performance data...</p>
        </div>
        <Skeleton className="h-10 w-64" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
