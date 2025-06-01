import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateRange } from 'react-day-picker';

interface AnalyticsData {
  date: string;
  redemptions: number;
  pointsEarned: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface DetailedMetric {
  name: string;
  value: string;
  unit: string;
  change: string;
}

const EnhancedRewardAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('redemptions');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [_dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSegment, setSelectedSegment] = useState('all');

  const [_isLoading, setIsLoading] = useState(false);

  const trendData: AnalyticsData[] = [
    { date: 'Jan', redemptions: 40, pointsEarned: 240 },
    { date: 'Feb', redemptions: 30, pointsEarned: 139 },
    { date: 'Mar', redemptions: 20, pointsEarned: 980 },
    { date: 'Apr', redemptions: 27, pointsEarned: 390 },
    { date: 'May', redemptions: 18, pointsEarned: 480 },
    { date: 'Jun', redemptions: 23, pointsEarned: 380 },
    { date: 'Jul', redemptions: 34, pointsEarned: 430 },
  ];

  const metricCards = [
    { title: 'Total Redemptions', value: '4,528', change: '+12%', trend: 'up' },
    { title: 'Points Earned', value: '125,890', change: '+8%', trend: 'up' },
    { title: 'Active Users', value: '2,345', change: '-3%', trend: 'down' },
    { title: 'Avg. Points/User', value: '54', change: '+5%', trend: 'up' },
  ];

  const detailedMetrics: DetailedMetric[] = [
    { name: 'New Users', value: '320', unit: 'users', change: '+15%' },
    { name: 'Repeat Users', value: '1,850', unit: 'users', change: '+7%' },
    { name: 'Conversion Rate', value: '4.2', unit: '%', change: '+0.5%' },
    { name: 'Avg. Order Value', value: '45.20', unit: '$', change: '-2%' },
    { name: 'Customer Lifetime Value', value: '680', unit: '$', change: '+3%' },
    { name: 'Points Redeemed', value: '75,000', unit: 'points', change: '+10%' },
  ];

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Reward Analytics</h2>
          <p className="text-muted-foreground">
            Track and analyze your reward program performance
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="redemptions">Redemptions</SelectItem>
            <SelectItem value="pointsEarned">Points Earned</SelectItem>
            <SelectItem value="activeUsers">Active Users</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="vip">VIP Users</SelectItem>
            <SelectItem value="new">New Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">
                {metric.change} vs last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="segments">Segment Analysis</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reward Trends</CardTitle>
              <CardDescription>
                Track reward program performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="redemptions" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Redemptions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pointsEarned" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Points Earned"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Analysis</CardTitle>
              <CardDescription>
                Analyze reward program performance by user segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Segment analysis content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Analysis</CardTitle>
              <CardDescription>
                Analyze reward program performance by user cohort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cohort analysis content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
              <CardDescription>
                Predict future reward program performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Prediction content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>
            Comprehensive breakdown of reward program metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedMetrics.map((metric) => (
              <div key={metric.name} className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {metric.name}
                </h4>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {metric.unit}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-sm">
                  <span className={metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  <span className="ml-1 text-muted-foreground">vs last period</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRewardAnalytics;
