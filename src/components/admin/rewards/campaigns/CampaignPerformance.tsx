import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CampaignMetrics {
  total_users_reached?: number;
  total_rewards_claimed?: number;
  engagement_rate?: number;
  total_points_awarded?: number;
  daily_metrics?: Array<{
    date: string;
    users_reached: number;
    rewards_claimed: number;
    engagement_rate: number;
    points_awarded: number;
  }>;
}

interface CampaignPerformanceProps {
  campaignId: string;
  metrics?: CampaignMetrics;
}

export function CampaignPerformance({ campaignId, metrics }: CampaignPerformanceProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Mock data for demonstration - preserved as placeholder
  const mockDailyMetrics = [
    { date: '2024-01-01', users_reached: 120, rewards_claimed: 45, engagement_rate: 0.75, points_awarded: 2250 },
    { date: '2024-01-02', users_reached: 135, rewards_claimed: 52, engagement_rate: 0.78, points_awarded: 2600 },
    { date: '2024-01-03', users_reached: 142, rewards_claimed: 48, engagement_rate: 0.72, points_awarded: 2400 },
    { date: '2024-01-04', users_reached: 156, rewards_claimed: 61, engagement_rate: 0.82, points_awarded: 3050 },
    { date: '2024-01-05', users_reached: 148, rewards_claimed: 55, engagement_rate: 0.79, points_awarded: 2750 },
    { date: '2024-01-06', users_reached: 134, rewards_claimed: 49, engagement_rate: 0.76, points_awarded: 2450 },
    { date: '2024-01-07', users_reached: 159, rewards_claimed: 63, engagement_rate: 0.84, points_awarded: 3150 }
  ];

  // Use mock data if metrics.daily_metrics is not available - preserves functionality
  const chartData = metrics?.daily_metrics || mockDailyMetrics;

  const totalUsersReached = metrics?.total_users_reached || chartData.reduce((sum, day) => sum + day.users_reached, 0);
  const totalRewardsClaimed = metrics?.total_rewards_claimed || chartData.reduce((sum, day) => sum + day.rewards_claimed, 0);
  const avgEngagementRate = metrics?.engagement_rate || chartData.reduce((sum, day) => sum + day.engagement_rate, 0) / chartData.length;
  const totalPointsAwarded = metrics?.total_points_awarded || chartData.reduce((sum, day) => sum + day.points_awarded, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campaign Performance</h3>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Engagement Rate</SelectItem>
              <SelectItem value="users">Users Reached</SelectItem>
              <SelectItem value="rewards">Rewards Claimed</SelectItem>
              <SelectItem value="points">Points Awarded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Reached</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsersReached.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Claimed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewardsClaimed.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgEngagementRate * 100).toFixed(1)}%</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.7%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {selectedMetric === 'engagement' && (
                <Line type="monotone" dataKey="engagement_rate" stroke="#8884d8" strokeWidth={2} />
              )}
              {selectedMetric === 'users' && (
                <Line type="monotone" dataKey="users_reached" stroke="#82ca9d" strokeWidth={2} />
              )}
              {selectedMetric === 'rewards' && (
                <Line type="monotone" dataKey="rewards_claimed" stroke="#ffc658" strokeWidth={2} />
              )}
              {selectedMetric === 'points' && (
                <Line type="monotone" dataKey="points_awarded" stroke="#ff7300" strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
