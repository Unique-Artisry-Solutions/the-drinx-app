
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RewardAnalytics, TimeSeriesData } from '@/lib/rewards/types';
import { mapAnalyticsTimeSeriesData } from '@/lib/rewards/utils/dataMappers';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/lib/rewards/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import TimeSeriesChart from './TimeSeriesChart';
import StatisticsCard from './StatisticsCard';
import TierDistributionChart from './TierDistributionChart';

interface ProgramStatisticsDashboardProps {
  establishmentId?: string;
}

export const ProgramStatisticsDashboard: React.FC<ProgramStatisticsDashboardProps> = ({ establishmentId }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);
  const [tierData, setTierData] = useState<{name: string, value: number}[]>([]);
  
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['rewardAnalytics', establishmentId, timeRange],
    queryFn: () => rewardsApi.getRewardAnalytics(establishmentId)
  });
  
  useEffect(() => {
    if (analytics) {
      // Convert analytics timeSeriesData to the expected format
      setChartData(mapAnalyticsTimeSeriesData(analytics.timeSeriesData));
      
      // Process tier distribution data if available
      if (analytics.tierDistribution && typeof analytics.tierDistribution === 'object') {
        const tierDistributionData = Object.entries(analytics.tierDistribution).map(([name, value]) => ({
          name,
          value: typeof value === 'number' ? value : 0
        }));
        setTierData(tierDistributionData);
      } else {
        // Provide default mock data if no tier distribution exists
        setTierData([
          { name: 'Bronze', value: 45 },
          { name: 'Silver', value: 30 },
          { name: 'Gold', value: 20 },
          { name: 'Platinum', value: 5 }
        ]);
      }
    }
  }, [analytics]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="tiers">Tier Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticsCard title="Total Points Earned" value={analytics?.totalPointsEarned || 0} />
                <StatisticsCard title="Total Points Redeemed" value={analytics?.totalPointsRedeemed || 0} />
                <StatisticsCard title="Redemption Rate" value={analytics?.redemptionRate || 0} />
              </div>
            )}
          </TabsContent>
          <TabsContent value="trends">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              <TimeSeriesChart data={chartData} />
            )}
          </TabsContent>
          <TabsContent value="tiers">
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              <TierDistributionChart data={tierData} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgramStatisticsDashboard;
