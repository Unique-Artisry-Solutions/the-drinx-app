
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, TrendingUp, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/lib/rewards/api';
import { Skeleton } from '@/components/ui/skeleton';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

interface RewardMetricsProps {
  establishmentId?: string;
}

const RewardMetrics: React.FC<RewardMetricsProps> = ({ establishmentId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['rewardAnalytics', establishmentId],
    queryFn: () => rewardsApi.getRewardAnalytics(establishmentId),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Members",
      value: data?.activeMembers?.toLocaleString() || '0',
      icon: Users,
      iconColor: "text-blue-500",
      backgroundColor: "bg-blue-50"
    },
    {
      title: "Points Earned",
      value: data?.totalPointsEarned?.toLocaleString() || '0',
      icon: Award,
      iconColor: "text-purple-500",
      backgroundColor: "bg-purple-50"
    },
    {
      title: "Points Redeemed",
      value: data?.totalPointsRedeemed?.toLocaleString() || '0',
      icon: Zap,
      iconColor: "text-amber-500",
      backgroundColor: "bg-amber-50"
    },
    {
      title: "Redemption Rate",
      value: `${Math.round(data?.redemptionRate || 0)}%`,
      icon: TrendingUp,
      iconColor: "text-green-500",
      backgroundColor: "bg-green-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <AnalyticsMetricCard
          key={index}
          {...metric}
        />
      ))}
    </div>
  );
};

export default RewardMetrics;
