
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

const PromoterRealTimeAnalyticsPage = () => {
  // Mock real-time analytics data
  const realTimeMetrics = {
    activeVisitors: 147,
    liveEvents: 3,
    recentBookings: 23,
    conversionRate: 8.5
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Real-Time Analytics</h1>
          <p className="text-muted-foreground">Monitor live activity and performance metrics</p>
        </div>

        {/* Real-Time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <div className="text-sm font-medium">Active Visitors</div>
              </div>
              <div className="text-2xl font-bold mt-1">{realTimeMetrics.activeVisitors}</div>
              <Badge variant="outline" className="text-green-600 mt-1">Live</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">Live Events</div>
              </div>
              <div className="text-2xl font-bold mt-1">{realTimeMetrics.liveEvents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <div className="text-sm font-medium">Recent Bookings</div>
              </div>
              <div className="text-2xl font-bold mt-1">{realTimeMetrics.recentBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <div className="text-sm font-medium">Conversion Rate</div>
              </div>
              <div className="text-2xl font-bold mt-1">{realTimeMetrics.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Analytics Content */}
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Advanced real-time analytics features coming soon
              </p>
              <Badge variant="outline">In Development</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromoterRealTimeAnalyticsPage;
