
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/lib/rewards/api';

interface RewardTrendsProps {
  establishmentId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

const RewardTrends: React.FC<RewardTrendsProps> = ({ 
  establishmentId,
  period = 'weekly'
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState(period);
  
  const { data, isLoading } = useQuery({
    queryKey: ['rewardTrends', establishmentId, selectedPeriod],
    queryFn: () => rewardsApi.getRewardAnalytics(establishmentId),
  });

  const chartData = React.useMemo(() => {
    if (!data?.timeSeriesData) return [];
    return data.timeSeriesData.map(item => ({
      name: item.date,
      earned: item.earned,
      redeemed: item.redeemed,
      net: item.earned - item.redeemed
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Reward Usage Trends</CardTitle>
        <Select
          value={selectedPeriod}
          onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSelectedPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <AnalyticsLineChart
          title=""
          data={chartData}
          series={[
            { key: 'earned', name: 'Points Earned', color: '#8884d8' },
            { key: 'redeemed', name: 'Points Redeemed', color: '#82ca9d' },
            { key: 'net', name: 'Net Change', color: '#ffc658' }
          ]}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default RewardTrends;
