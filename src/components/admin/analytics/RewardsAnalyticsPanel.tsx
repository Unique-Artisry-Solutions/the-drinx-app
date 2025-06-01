import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Award, DollarSign, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface RewardsData {
  totalUsers: number;
  activeRewards: number;
  pointsDistributed: number;
  revenueImpact: number;
  userEngagement: {
    dailyActiveUsers: number[];
    weeklyActiveUsers: number[];
  };
  rewardRedemptions: {
    rewardName: string;
    count: number;
  }[];
  userTierDistribution: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockRewardsData: RewardsData = {
  totalUsers: 2547,
  activeRewards: 34,
  pointsDistributed: 45678,
  revenueImpact: 12450,
  userEngagement: {
    dailyActiveUsers: [50, 60, 70, 80, 90, 100, 110],
    weeklyActiveUsers: [300, 350, 400, 450, 500, 550, 600],
  },
  rewardRedemptions: [
    { rewardName: 'Free Coffee', count: 150 },
    { rewardName: 'Discounted Meal', count: 120 },
    { rewardName: 'Bonus Points', count: 90 },
  ],
  userTierDistribution: [
    { name: 'Bronze', value: 1200 },
    { name: 'Silver', value: 800 },
    { name: 'Gold', value: 400 },
    { name: 'Platinum', value: 147 },
  ],
};

const RewardsAnalyticsPanel: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('7d');
  const [rewardsData, setRewardsData] = useState<RewardsData>(mockRewardsData);

  useEffect(() => {
    // Simulate fetching data from an API
    // Replace this with your actual data fetching logic
    setTimeout(() => {
      setRewardsData(mockRewardsData);
    }, 500);
  }, [timeFrame]);

  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
  };

  const distributionData = rewardsData.userTierDistribution;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rewards Program Analytics</h2>
          <p className="text-muted-foreground">
            Analyze rewards program performance and user engagement.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="distribution">User Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Total number of users in the rewards program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rewardsData.totalUsers}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span>+12% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Rewards</CardTitle>
                <CardDescription>Number of rewards currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rewardsData.activeRewards}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span>+8% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Points Distributed</CardTitle>
                <CardDescription>Total points distributed to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rewardsData.pointsDistributed}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span>+15% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
                <CardDescription>Estimated revenue impact from rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${rewardsData.revenueImpact}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                  <span>+22% vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Daily active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={rewardsData.userEngagement.dailyActiveUsers.map((value, index) => ({ day: index + 1, users: value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" name="Daily Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Redemptions</CardTitle>
                <CardDescription>Most frequently redeemed rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rewardsData.rewardRedemptions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rewardName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Redemptions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Track user engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleTimeFrameChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time frame" defaultValue={timeFrame} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rewardsData.userEngagement.weeklyActiveUsers.map((value, index) => ({ week: index + 1, users: value }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Weekly Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Tier Distribution</CardTitle>
              <CardDescription>Distribution of users across reward tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tier Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of users in each tier</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Tier</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewardsData.userTierDistribution.map((tier) => (
                    <TableRow key={tier.name}>
                      <TableCell className="font-medium">{tier.name}</TableCell>
                      <TableCell>{tier.value}</TableCell>
                      <TableCell>{((tier.value / rewardsData.totalUsers) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsAnalyticsPanel;
