
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { RealTimeMetrics } from '@/services/realTimeAnalyticsService';

interface EventPerformanceMetricsProps {
  eventId: string;
  metrics: RealTimeMetrics;
}

const EventPerformanceMetrics: React.FC<EventPerformanceMetricsProps> = ({ 
  eventId, 
  metrics 
}) => {
  // Mock data for real-time performance - in production, this would come from API
  const ticketSalesData = [
    { name: 'Day 1', sales: 12 },
    { name: 'Day 2', sales: 19 },
    { name: 'Day 3', sales: 23 },
    { name: 'Day 4', sales: 31 },
    { name: 'Day 5', sales: 28 },
    { name: 'Day 6', sales: 35 },
    { name: 'Day 7', sales: 42 }
  ];

  const engagementData = [
    { name: '9 AM', value: 45 },
    { name: '12 PM', value: 78 },
    { name: '3 PM', value: 92 },
    { name: '6 PM', value: 134 },
    { name: '9 PM', value: 156 },
    { name: '12 AM', value: 89 }
  ];

  const channelPerformanceData = [
    { name: 'Social Media', clicks: 1240, conversions: 98 },
    { name: 'Email', clicks: 890, conversions: 156 },
    { name: 'Direct', clicks: 567, conversions: 89 },
    { name: 'Referral', clicks: 234, conversions: 45 }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-green-600 mt-1">+12% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pageViews}</div>
            <p className="text-xs text-green-600 mt-1">+8% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.userEngagement}%</div>
            <p className="text-xs text-blue-600 mt-1">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={ticketSalesData}
              height={300}
              series={[{ key: 'sales', name: 'Sales', color: '#3B82F6' }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart
              data={engagementData}
              height={300}
              series={[{ key: 'value', name: 'Engagement', color: '#10B981' }]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Marketing Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={channelPerformanceData}
              height={300}
              series={[
                { key: 'clicks', name: 'Clicks', color: '#8B5CF6' },
                { key: 'conversions', name: 'Conversions', color: '#F59E0B' }
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventPerformanceMetrics;
