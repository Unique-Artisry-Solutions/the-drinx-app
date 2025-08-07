import React, { useEffect, useState } from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart3, Users, TrendingUp, Activity, Download, RefreshCw } from 'lucide-react';

const SystemAnalyticsPage: React.FC = () => {
  const { trackPage } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Track page view
  useEffect(() => {
    trackPage('admin_analytics_page');
  }, [trackPage]);

  const pageConfig = {
    title: 'System Analytics',
    description: 'Comprehensive analytics and insights for platform performance',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Export Report',
      icon: Download,
      variant: 'default' as const,
      onClick: () => console.log('Export analytics report')
    },
    {
      label: 'Refresh Data',
      icon: RefreshCw,
      variant: 'outline' as const,
      onClick: () => console.log('Refresh analytics data')
    }
  ];

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalUsers: 12847,
      activeUsers: 8934,
      totalEstablishments: 328,
      totalCocktails: 1543,
      averageRating: 4.2,
      conversionRate: 12.5
    },
    userMetrics: [
      { label: 'Daily Active Users', value: '2,847', change: '+5.2%', trend: 'up' },
      { label: 'Weekly Active Users', value: '8,934', change: '+2.1%', trend: 'up' },
      { label: 'Monthly Active Users', value: '12,847', change: '+8.7%', trend: 'up' },
      { label: 'User Retention Rate', value: '68%', change: '-1.2%', trend: 'down' }
    ],
    establishmentMetrics: [
      { label: 'New Establishments', value: '23', change: '+12%', trend: 'up' },
      { label: 'Active Establishments', value: '285', change: '+3%', trend: 'up' },
      { label: 'Average Cocktails per Est.', value: '4.7', change: '+0.3', trend: 'up' },
      { label: 'Establishment Rating', value: '4.2', change: '+0.1', trend: 'up' }
    ],
    performance: [
      { label: 'Page Load Time', value: '1.2s', status: 'good' },
      { label: 'API Response Time', value: '180ms', status: 'excellent' },
      { label: 'Uptime', value: '99.9%', status: 'excellent' },
      { label: 'Error Rate', value: '0.01%', status: 'excellent' }
    ]
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <Activity className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      warning: 'outline',
      poor: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Establishments</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalEstablishments}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Visitor to user</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="establishments">Establishments</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  High-level metrics and key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Comprehensive analytics dashboard coming soon. This will include charts, 
                    graphs, and detailed insights about user behavior and platform performance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.userMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="establishments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.establishmentMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.performance.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                    {getStatusBadge(metric.status)}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">Current performance</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default SystemAnalyticsPage;