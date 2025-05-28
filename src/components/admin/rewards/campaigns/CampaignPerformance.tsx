
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, Download, LineChartIcon, Users } from 'lucide-react';
import { RewardCampaign } from '@/lib/rewards/types';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from 'recharts';

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Enhanced data with formatted dates
  const enhancedEngagementData = metrics.daily_metrics.map(day => ({
    name: formatDate(day.date),
    "Users Reached": day.users_reached,
    "Rewards Claimed": day.rewards_claimed
  }));
  
  const enhancedPointsData = metrics.daily_metrics.map(day => ({
    name: formatDate(day.date),
    "Points Awarded": day.points_awarded
  }));
  
  // Export data as CSV
  const exportData = () => {
    const header = 'Date,Users Reached,Rewards Claimed,Points Awarded\n';
    const csvData = metrics.daily_metrics.map(day => 
      `${day.date},${day.users_reached},${day.rewards_claimed},${day.points_awarded}`
    ).join('\n');
    
    const blob = new Blob([header + csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_performance.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
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
        <Button variant="outline" size="sm" onClick={exportData}>
          <Download className="h-4 w-4 mr-1" />
          Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users Reached</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_users_reached.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rewards Claimed</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_rewards_claimed.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{(metrics.engagement_rate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <div className="text-2xl font-bold">{metrics.total_points_awarded.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="engagement" className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Engagement</span>
            <span className="sm:hidden">Engage</span>
          </TabsTrigger>
          <TabsTrigger value="points" className="flex items-center">
            <BarChartIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Points Awarded</span>
            <span className="sm:hidden">Points</span>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enhancedEngagementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Users Reached" fill="#4f46e5" />
                    <Bar dataKey="Rewards Claimed" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trend</CardTitle>
              <CardDescription>
                User engagement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={enhancedEngagementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="Users Reached" 
                      stroke="#4f46e5" 
                      fill="#4f46e580"
                      activeDot={{ r: 8 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Rewards Claimed" 
                      stroke="#10b981" 
                      fill="#10b98180" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={enhancedPointsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Points Awarded" 
                      stroke="#9333ea" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Points Distribution</CardTitle>
              <CardDescription>
                Daily breakdown of points awarded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enhancedPointsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Points Awarded" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
