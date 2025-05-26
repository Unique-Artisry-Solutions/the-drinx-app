
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useOptimizedRealTimeAnalytics } from '@/hooks/useOptimizedRealTimeAnalytics';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  changePercentage?: number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend = 'stable', 
  changePercentage = 0,
  icon 
}) => {
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
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        {changePercentage !== 0 && (
          <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {changePercentage > 0 ? '+' : ''}{changePercentage}%
            </span>
          </div>
        )}
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
    refreshInterval: 30000
  });

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  };

  const handleRefreshViews = async () => {
    try {
      await refreshMaterializedViews();
    } catch (error) {
      console.error('Error refreshing materialized views:', error);
    }
  };

  // Process chart data for display
  const processedChartData = React.useMemo(() => {
    const dataByDate = chartData.reduce((acc, point) => {
      if (!acc[point.date]) {
        acc[point.date] = { date: point.date };
      }
      acc[point.date][point.metric] = point.value;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dataByDate);
  }, [chartData]);

  // Get recent trends for metrics
  const getMetricTrend = (metric: string) => {
    const metricData = chartData.filter(d => d.metric === metric).slice(-2);
    if (metricData.length < 2) return { trend: 'stable' as const, changePercentage: 0 };
    
    const latest = metricData[metricData.length - 1];
    return { trend: latest.trend, changePercentage: latest.changePercentage };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
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
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Views
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          {...getMetricTrend('activeUsers')}
        />
        <MetricCard
          title="Page Views"
          value={metrics.pageViews}
          {...getMetricTrend('pageViews')}
        />
        <MetricCard
          title="Conversions"
          value={metrics.conversions}
          {...getMetricTrend('conversions')}
        />
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          {...getMetricTrend('revenue')}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Analytics data from the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeFrameData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
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
                      dataKey="pageViews" 
                      stroke="#82ca9d" 
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No analytics data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>
                Performance trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={processedChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" fill="#8884d8" name="Active Users" />
                    <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No trend data available
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
                Event performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-2xl font-bold">{eventAnalytics.totalAttendees}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Checked In</p>
                  <p className="text-2xl font-bold">{eventAnalytics.checkedInAttendees}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${eventAnalytics.revenue}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{eventAnalytics.conversionRate.toFixed(1)}%</p>
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
