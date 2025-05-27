
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsLineChart } from '@/components/charts/AnalyticsLineChart';
import { AnalyticsPieChart } from '@/components/charts/AnalyticsPieChart';
import { AnalyticsBarChart } from '@/components/charts/AnalyticsBarChart';

interface AffiliateAnalyticsProps {
  promoterId: string;
}

export const AffiliateAnalytics: React.FC<AffiliateAnalyticsProps> = ({ promoterId }) => {
  // Mock analytics data - replace with actual API calls
  const clicksData = [
    { name: 'Jan', value: 240 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 450 },
    { name: 'Apr', value: 380 },
    { name: 'May', value: 520 },
    { name: 'Jun', value: 650 },
  ];

  const conversionData = [
    { name: 'Direct Traffic', value: 45, color: '#0088FE' },
    { name: 'Social Media', value: 30, color: '#00C49F' },
    { name: 'Email', value: 15, color: '#FFBB28' },
    { name: 'Other', value: 10, color: '#FF8042' },
  ];

  const performanceData = [
    { name: 'Week 1', clicks: 180, conversions: 12 },
    { name: 'Week 2', clicks: 220, conversions: 18 },
    { name: 'Week 3', clicks: 280, conversions: 22 },
    { name: 'Week 4', clicks: 320, conversions: 28 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Affiliate Analytics</h2>
        <p className="text-muted-foreground">Detailed performance insights for your affiliate programs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Click Trends</CardTitle>
            <CardDescription>Monthly affiliate link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsLineChart data={clicksData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your affiliate traffic comes from</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={conversionData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Weekly clicks vs conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsBarChart data={performanceData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2%</div>
            <p className="text-sm text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$85</div>
            <p className="text-sm text-muted-foreground">+$12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$340</div>
            <p className="text-sm text-muted-foreground">Average per partner</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
