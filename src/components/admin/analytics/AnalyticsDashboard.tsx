
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useOptimizedRealTimeAnalytics } from '@/hooks/useOptimizedRealTimeAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, changePercentage }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">{title}</p>
          {getTrendIcon()}
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-xs ${getTrendColor()}`}>
            {changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    metrics, 
    timeFrameData, 
    chartData, 
    eventAnalytics,
    isLoading, 
    error, 
    refresh,
    refreshMaterializedViews
  } = useOptimizedRealTimeAnalytics({
    enableRealTime: true,
    refreshInterval: 300000 // 5 minutes
  });

  const handleRefresh = async () => {
    console.log('Refreshing analytics dashboard...');
    await refresh();
  };

  const handleRefreshViews = async () => {
    console.log('Refreshing materialized views...');
    await refreshMaterializedViews();
  };

  // Helper function to calculate trend from chart data
  const getMetricTrend = (metricName: string): { trend: 'up' | 'down' | 'stable', changePercentage: number } => {
    const metricChartData = chartData.filter(point => point.metric === metricName);
    
    if (metricChartData.length < 2) {
      return { trend: 'stable', changePercentage: 0 };
    }

    // Get the last two data points to calculate trend
    const recent = metricChartData[metricChartData.length - 1];
    const previous = metricChartData[metricChartData.length - 2];
    
    if (!recent || !previous) {
      return { trend: 'stable', changePercentage: 0 };
    }

    const change = recent.value - previous.value;
    const changePercentage = previous.value > 0 ? (change / previous.value) * 100 : 0;
    
    let trend: 'up' | 'down' | 'stable';
    if (Math.abs(changePercentage) < 1) {
      trend = 'stable';
    } else if (changePercentage > 0) {
      trend = 'up';
    } else {
      trend = 'down';
    }

    return { trend, changePercentage };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading analytics: {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Please try refreshing or contact support if the issue persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={handleRefreshViews} variant="outline" size="sm">
            Refresh Views
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers.toLocaleString()}
              {...getMetricTrend('activeUsers')}
            />
            <MetricCard
              title="Page Views"
              value={metrics.pageViews.toLocaleString()}
              {...getMetricTrend('pageViews')}
            />
            <MetricCard
              title="Conversions"
              value={metrics.conversions.toLocaleString()}
              {...getMetricTrend('conversions')}
            />
            <MetricCard
              title="Revenue"
              value={`$${metrics.revenue.toLocaleString()}`}
              {...getMetricTrend('revenue')}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Key metrics over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">User Engagement</p>
                  <p className="text-2xl font-bold">{metrics.userEngagement.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Average page views per user
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold">{metrics.eventCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Events tracked in the last 24 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>
                Analytics trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeFrameData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeFrameData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#8884d8" 
                      name="Active Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#82ca9d" 
                      name="Conversions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">No trend data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>
                Event-specific performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm font-medium">Total Attendees</p>
                  <p className="text-2xl font-bold">{eventAnalytics.totalAttendees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Checked In</p>
                  <p className="text-2xl font-bold">{eventAnalytics.checkedInAttendees.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Event Revenue</p>
                  <p className="text-2xl font-bold">${eventAnalytics.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold">{(eventAnalytics.conversionRate * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
