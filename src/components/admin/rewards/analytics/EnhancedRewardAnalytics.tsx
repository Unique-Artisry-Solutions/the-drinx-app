import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateRange } from 'react-day-picker';

// Mock data for analytics - preserved as placeholder
const mockAnalyticsData = {
  totalUsers: 12456,
  activeUsers: 8934,
  totalPointsAwarded: 245678,
  totalRewardsClaimed: 1234,
  engagementRate: 73.2,
  retentionRate: 65.8,
  averageSessionDuration: 12.5,
  topPerformingPrograms: [
    { name: 'Welcome Bonus', participants: 3456, points: 51840 },
    { name: 'Daily Check-in', participants: 2890, points: 43350 },
    { name: 'Referral Program', participants: 1567, points: 78350 }
  ],
  monthlyTrends: [
    { month: 'Jan', users: 8500, points: 125000, rewards: 890 },
    { month: 'Feb', users: 9200, points: 138000, rewards: 945 },
    { month: 'Mar', users: 9800, points: 147000, rewards: 1020 },
    { month: 'Apr', users: 10500, points: 157500, rewards: 1180 },
    { month: 'May', users: 11200, points: 168000, rewards: 1250 },
    { month: 'Jun', users: 12456, points: 186840, rewards: 1390 }
  ]
};

interface EnhancedRewardAnalyticsProps {
  _dateRange?: DateRange;
}

export function EnhancedRewardAnalytics({ _dateRange }: EnhancedRewardAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('users');
  const [timeFrame, setTimeFrame] = useState('6months');

  // Analytics data - using mock data as placeholder
  const data = mockAnalyticsData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enhanced Reward Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">+12.5% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">+8.3% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPointsAwarded.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">+15.2% from last month</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Claimed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRewardsClaimed.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">+22.1% from last month</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="rewards">Rewards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedMetric === 'users' && (
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Users" />
                  )}
                  {selectedMetric === 'points' && (
                    <Line type="monotone" dataKey="points" stroke="#82ca9d" strokeWidth={2} name="Points" />
                  )}
                  {selectedMetric === 'rewards' && (
                    <Line type="monotone" dataKey="rewards" stroke="#ffc658" strokeWidth={2} name="Rewards" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPerformingPrograms.map((program, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{program.name}</h4>
                      <p className="text-sm text-muted-foreground">{program.participants.toLocaleString()} participants</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{program.points.toLocaleString()} points</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{data.engagementRate}%</div>
                <p className="text-sm text-muted-foreground mt-2">Average user engagement with reward programs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{data.retentionRate}%</div>
                <p className="text-sm text-muted-foreground mt-2">Users returning within 30 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
