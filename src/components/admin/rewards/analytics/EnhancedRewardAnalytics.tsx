
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const EnhancedRewardAnalytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [_dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  
  const [_isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const performanceData = [
    { date: '2024-01', redemptions: 120, points: 15600, users: 89 },
    { date: '2024-02', redemptions: 145, points: 18900, users: 102 },
    { date: '2024-03', redemptions: 132, points: 17200, users: 95 },
    { date: '2024-04', redemptions: 168, points: 21800, users: 118 },
    { date: '2024-05', redemptions: 189, points: 24500, users: 134 },
  ];

  const engagementData = [
    { week: 'Week 1', engagement: 78, conversion: 12 },
    { week: 'Week 2', engagement: 82, conversion: 15 },
    { week: 'Week 3', engagement: 75, conversion: 11 },
    { week: 'Week 4', engagement: 88, conversion: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Enhanced Rewards Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics for your rewards program performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redemption Performance</CardTitle>
              <CardDescription>Track reward redemptions and point usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="redemptions" fill="#8884d8" name="Redemptions" />
                  <Bar dataKey="users" fill="#82ca9d" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>Monitor how users interact with your rewards program</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement %" />
                  <Line type="monotone" dataKey="conversion" stroke="#82ca9d" name="Conversion %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Identify patterns and growth opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Advanced trend analysis and forecasting will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedRewardAnalytics;
