
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import RealTimeMonitoringComponent from './RealTimeMonitoringComponent';
import TrendAnalysisComponent from './TrendAnalysisComponent';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { metrics, timeFrameData, chartData, isLoading, error } = useRealTimeAnalytics();

  // Mock data for demonstration
  const overviewMetrics = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12%",
      trend: "up" as const,
      icon: Users
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+5%",
      trend: "up" as const,
      icon: Activity
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+8%",
      trend: "up" as const,
      icon: DollarSign
    },
    {
      title: "Events",
      value: "89",
      change: "-2%",
      trend: "down" as const,
      icon: Calendar
    }
  ];

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
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
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error loading analytics: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.change} from last month
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Analytics Overview
          </CardTitle>
          <CardDescription>
            Live system metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Page Views</span>
              </div>
              <div className="text-2xl font-bold">{metrics.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Conversions</span>
              </div>
              <div className="text-2xl font-bold">{metrics.conversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                High-level metrics and system health indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">User Engagement</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Daily Active Users</span>
                        <Badge variant="outline">+15%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Session Duration</span>
                        <Badge variant="outline">12:34 avg</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bounce Rate</span>
                        <Badge variant="outline">23%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">System Health</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">API Response Time</span>
                        <Badge variant="outline">145ms</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Error Rate</span>
                        <Badge variant="outline">0.2%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime</span>
                        <Badge variant="outline">99.9%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeMonitoringComponent />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendAnalysisComponent />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis and optimization insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Database Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Query Response Time</span>
                      <Badge variant="outline">23ms avg</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Connection Pool</span>
                      <Badge variant="outline">75% used</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Slow Queries</span>
                      <Badge variant="outline">3 detected</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Frontend Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Page Load Time</span>
                      <Badge variant="outline">1.2s avg</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bundle Size</span>
                      <Badge variant="outline">234KB</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cache Hit Rate</span>
                      <Badge variant="outline">89%</Badge>
                    </div>
                  </div>
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
