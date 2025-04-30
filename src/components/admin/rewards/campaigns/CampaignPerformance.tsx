
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Download, Users } from 'lucide-react';
import { RewardCampaign } from '@/lib/rewards/types';
import { Skeleton } from '@/components/ui/skeleton';

interface CampaignPerformanceProps {
  campaign?: RewardCampaign;
  isLoading?: boolean;
}

export const CampaignPerformance = ({ campaign, isLoading = false }: CampaignPerformanceProps) => {
  // Sample data for preview mode
  const sampleMetrics = {
    total_users_reached: 1245,
    total_rewards_claimed: 876,
    engagement_rate: 0.72,
    total_points_awarded: 12500,
    roi_estimate: 3.2,
    daily_metrics: [
      { date: '2025-04-20', users_reached: 120, rewards_claimed: 78, points_awarded: 1200 },
      { date: '2025-04-21', users_reached: 140, rewards_claimed: 92, points_awarded: 1450 },
      { date: '2025-04-22', users_reached: 180, rewards_claimed: 110, points_awarded: 1800 },
      { date: '2025-04-23', users_reached: 210, rewards_claimed: 145, points_awarded: 2100 },
      { date: '2025-04-24', users_reached: 235, rewards_claimed: 165, points_awarded: 2350 },
      { date: '2025-04-25', users_reached: 260, rewards_claimed: 186, points_awarded: 2600 },
      { date: '2025-04-26', users_reached: 100, rewards_claimed: 100, points_awarded: 1000 },
    ]
  };

  const metrics = campaign?.performance_metrics || sampleMetrics;
  
  const engagementData = metrics.daily_metrics.map(day => ({
    name: day.date.split('T')[0].split('-')[2], // Just show day number for x-axis
    "Users Reached": day.users_reached,
    "Rewards Claimed": day.rewards_claimed
  }));
  
  const pointsData = metrics.daily_metrics.map(day => ({
    name: day.date.split('T')[0].split('-')[2], // Just show day number for x-axis
    "Points Awarded": day.points_awarded
  }));
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Campaign Performance</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users Reached</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_users_reached.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rewards Claimed</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_rewards_claimed.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{(metrics.engagement_rate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_points_awarded.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="engagement">
        <TabsList className="mb-4">
          <TabsTrigger value="engagement">
            <Users className="h-4 w-4 mr-1" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="points">
            <ChartBar className="h-4 w-4 mr-1" />
            Points Awarded
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily User Engagement</CardTitle>
              <CardDescription>
                Users reached vs rewards claimed per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={engagementData}
                  index="name"
                  categories={["Users Reached", "Rewards Claimed"]}
                  colors={["blue", "green"]}
                  valueFormatter={(value) => `${value}`}
                  yAxisWidth={48}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Points Awarded</CardTitle>
              <CardDescription>
                Total points awarded per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={pointsData}
                  index="name"
                  categories={["Points Awarded"]}
                  colors={["purple"]}
                  valueFormatter={(value) => `${value} pts`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
