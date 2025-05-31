
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TierDistributionChart from './TierDistributionChart';
import { FunnelVisualization } from './FunnelVisualization';
import StatisticsCard from './StatisticsCard';

export function ProgramStatisticsDashboard() {
  const [timeRange] = useState('7d');

  // Mock data - preserved as placeholder for future functionality
  const tierData = [
    { name: 'Bronze', value: 450 },
    { name: 'Silver', value: 280 },
    { name: 'Gold', value: 120 },
    { name: 'Platinum', value: 45 }
  ];

  const funnelData = [
    { name: 'Signed Up', value: 1000, fill: '#8884d8' },
    { name: 'First Purchase', value: 750, fill: '#82ca9d', dropOffRate: 25 },
    { name: 'Second Purchase', value: 500, fill: '#ffc658', dropOffRate: 33 },
    { name: 'Loyal Customer', value: 200, fill: '#ff7300', dropOffRate: 60 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Program Statistics</h2>
        <Select value={timeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatisticsCard
          title="Total Users"
          value="1,245"
          change={12.5}
          icon="users"
        />
        <StatisticsCard
          title="Active Users"
          value="892"
          change={8.2}
          icon="activity"
        />
        <StatisticsCard
          title="Rewards Earned"
          value="3,456"
          change={15.3}
          icon="gift"
        />
        <StatisticsCard
          title="Redemption Rate"
          value="68.2%"
          change={4.1}
          icon="percent"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">Tier Distribution</TabsTrigger>
          <TabsTrigger value="funnel">User Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive statistics dashboard will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <TierDistributionChart data={tierData} />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <FunnelVisualization data={funnelData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
