
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, Users, TrendingUp, Zap } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { useQuery } from '@tanstack/react-query';
import { rewardsApi } from '@/lib/rewards/api';
import { Skeleton } from '@/components/ui/skeleton';
import { RewardAnalytics } from '@/lib/rewards/types';

interface RewardsAnalyticsPanelProps {
  establishmentId?: string;
}

const RewardsAnalyticsPanel: React.FC<RewardsAnalyticsPanelProps> = ({ establishmentId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rewardAnalytics', establishmentId],
    queryFn: () => rewardsApi.getRewardAnalytics(establishmentId),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards Program Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards Program Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading rewards analytics data</p>
        </CardContent>
      </Card>
    );
  }

  const analyticsData = data as RewardAnalytics;

  // Create metrics for display
  const metrics = [
    {
      title: "Points Earned",
      value: analyticsData.totalPointsEarned.toLocaleString(),
      icon: Award,
      iconColor: "text-purple-500",
      backgroundColor: "bg-purple-50"
    },
    {
      title: "Points Redeemed",
      value: analyticsData.totalPointsRedeemed.toLocaleString(),
      icon: Zap,
      iconColor: "text-amber-500",
      backgroundColor: "bg-amber-50"
    },
    {
      title: "Points Economy",
      value: analyticsData.pointsEconomyBalance.toLocaleString(),
      icon: TrendingUp,
      iconColor: "text-green-500",
      backgroundColor: "bg-green-50"
    },
    {
      title: "Redemption Rate",
      value: `${Math.round(analyticsData.redemptionRate)}%`,
      icon: Users,
      iconColor: "text-blue-500",
      backgroundColor: "bg-blue-50"
    }
  ];

  // Prepare source breakdown data for pie chart
  const sourceData = Object.entries(analyticsData.sourcesBreakdown || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rewards Program Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <AnalyticsMetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconColor={metric.iconColor}
              backgroundColor={metric.backgroundColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Points Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Points Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.timeSeriesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="pointsEarned" 
                      name="Points Earned" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pointsRedeemed" 
                      name="Points Redeemed" 
                      stackId="2"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Points Source Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Points Sources Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Points']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rewards Program Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="pointsEarned" 
                    name="Points Earned" 
                    fill="#8884d8" 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="netPoints" 
                    name="Net Points Balance" 
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default RewardsAnalyticsPanel;
