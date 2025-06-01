
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

interface RewardsAnalyticsData {
  totalPointsAwarded: number;
  activeUsers: number;
  redemptionRate: number;
  programEffectiveness: number;
}

const RewardsAnalyticsPanel: React.FC = () => {
  const [analyticsData] = useState<RewardsAnalyticsData>({
    totalPointsAwarded: 125000,
    activeUsers: 2847,
    redemptionRate: 68.5,
    programEffectiveness: 82.3
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const recentRedemptions = [
    { id: '1', user: 'John Doe', points: 500, reward: 'Free Mocktail', date: '2024-01-15' },
    { id: '2', user: 'Jane Smith', points: 1000, reward: 'Premium Experience', date: '2024-01-14' },
    { id: '3', user: 'Bob Johnson', points: 250, reward: 'Discount Voucher', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rewards Analytics</h2>
        <div className="flex gap-2">
          <Button 
            variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={selectedTimeframe === '90d' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Total Points Awarded"
          value={analyticsData.totalPointsAwarded.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-blue-500"
          change={12.5}
        />
        <AnalyticsMetricCard
          title="Active Users"
          value={analyticsData.activeUsers.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-green-500"
          change={8.3}
        />
        <AnalyticsMetricCard
          title="Redemption Rate"
          value={`${analyticsData.redemptionRate}%`}
          icon={TrendingUp}
          iconColor="text-purple-500"
          change={5.2}
        />
        <AnalyticsMetricCard
          title="Program Effectiveness"
          value={`${analyticsData.programEffectiveness}%`}
          icon={TrendingUp}
          iconColor="text-orange-500"
          change={15.7}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="redemptions">Recent Redemptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive analytics for your rewards program performance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed performance analytics and trends.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="redemptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRedemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">{redemption.user}</TableCell>
                      <TableCell>{redemption.points}</TableCell>
                      <TableCell>{redemption.reward}</TableCell>
                      <TableCell>{redemption.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsAnalyticsPanel;
