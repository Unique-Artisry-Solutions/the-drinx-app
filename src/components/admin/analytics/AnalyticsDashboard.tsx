
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOptimizedRealTimeAnalytics } from '@/hooks/useOptimizedRealTimeAnalytics';
import AnalyticsErrorBoundary from '@/components/analytics/AnalyticsErrorBoundary';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const { metrics, timeFrameData, chartData, isLoading, error } = useOptimizedRealTimeAnalytics({
    enableRealTime: true,
    refreshInterval: 60000
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AnalyticsErrorBoundary>
      <div className="space-y-6">
        {/* Metrics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pageViews}</div>
              <p className="text-xs text-muted-foreground">Views today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversions}</div>
              <p className="text-xs text-muted-foreground">Conversions today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.revenue}</div>
              <p className="text-xs text-muted-foreground">Revenue today</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  High-level metrics and system performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">User Engagement</h4>
                      <div className="text-2xl font-bold">{metrics.userEngagement.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Average engagement score</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Event Count</h4>
                      <div className="text-2xl font-bold">{metrics.eventCount}</div>
                      <p className="text-xs text-muted-foreground">Total events tracked</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Analytics trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.length > 0 ? (
                    <div className="grid gap-4">
                      {chartData.slice(0, 5).map((point, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{point.metric}</p>
                            <p className="text-sm text-muted-foreground">{point.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{point.value}</p>
                            <p className={`text-xs ${
                              point.trend === 'up' ? 'text-green-600' : 
                              point.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {point.changePercentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No trend data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  User behavior and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeFrameData.length > 0 ? (
                    <div className="grid gap-4">
                      {timeFrameData.slice(0, 7).map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{day.date}</p>
                          </div>
                          <div className="text-right space-x-4">
                            <span className="text-sm">{day.activeUsers} users</span>
                            <span className="text-sm">{day.pageViews} views</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No user data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <p className="text-red-600 text-sm">
                Some analytics data failed to load: {error}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AnalyticsErrorBoundary>
  );
};

export default AnalyticsDashboard;
