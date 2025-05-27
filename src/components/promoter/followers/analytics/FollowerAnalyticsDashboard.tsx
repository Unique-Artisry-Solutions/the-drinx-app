
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FollowerGrowthChart from './FollowerGrowthChart';
import EngagementMetrics from './EngagementMetrics';
import DemographicAnalytics from './DemographicAnalytics';
import FollowerDataExport from './FollowerDataExport';
import { TrendingUp, Activity, Users, Download, BarChart3 } from 'lucide-react';

interface FollowerAnalyticsDashboardProps {
  promoterId: string;
  followerCount: number;
}

const FollowerAnalyticsDashboard: React.FC<FollowerAnalyticsDashboardProps> = ({
  promoterId,
  followerCount
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data - in real implementation, this would come from API
  const growthData = [
    { date: '2024-01-01', newFollowers: 15, totalFollowers: 245, unfollowers: 2 },
    { date: '2024-01-07', newFollowers: 23, totalFollowers: 268, unfollowers: 1 },
    { date: '2024-01-14', newFollowers: 18, totalFollowers: 286, unfollowers: 3 },
    { date: '2024-01-21', newFollowers: 31, totalFollowers: 317, unfollowers: 2 },
    { date: '2024-01-28', newFollowers: 27, totalFollowers: 344, unfollowers: 1 }
  ];

  const engagementData = [
    { contentType: 'Events', views: 1250, likes: 89, comments: 23, shares: 12, engagementRate: 9.8 },
    { contentType: 'Promotions', views: 980, likes: 156, comments: 34, shares: 28, engagementRate: 22.2 },
    { contentType: 'General Updates', views: 720, likes: 67, comments: 15, shares: 8, engagementRate: 12.5 }
  ];

  const topContent = [
    { title: 'Summer Music Festival 2024', type: 'event' as const, engagementScore: 95.2, reach: 2340, clicks: 186 },
    { title: '20% Off Early Bird Tickets', type: 'promotion' as const, engagementScore: 87.8, reach: 1890, clicks: 234 },
    { title: 'Meet the Artists Behind the Scenes', type: 'general' as const, engagementScore: 72.1, reach: 1250, clicks: 98 }
  ];

  const totalEngagement = {
    views: 2950,
    likes: 312,
    comments: 72,
    shares: 48,
    averageEngagementRate: 14.8
  };

  const demographicData = {
    ageGroups: [
      { range: '18-24', count: 89, percentage: 25.8 },
      { range: '25-34', count: 142, percentage: 41.3 },
      { range: '35-44', count: 78, percentage: 22.7 },
      { range: '45-54', count: 28, percentage: 8.1 },
      { range: '55+', count: 7, percentage: 2.0 }
    ],
    genderDistribution: [
      { gender: 'Female', count: 198, percentage: 57.6 },
      { gender: 'Male', count: 134, percentage: 39.0 },
      { gender: 'Non-binary', count: 8, percentage: 2.3 },
      { gender: 'Prefer not to say', count: 4, percentage: 1.2 }
    ],
    locationData: [
      { location: 'New York, NY', count: 89, percentage: 25.9 },
      { location: 'Los Angeles, CA', count: 67, percentage: 19.5 },
      { location: 'Chicago, IL', count: 43, percentage: 12.5 },
      { location: 'Miami, FL', count: 38, percentage: 11.0 },
      { location: 'Austin, TX', count: 29, percentage: 8.4 },
      { location: 'Seattle, WA', count: 24, percentage: 7.0 },
      { location: 'Boston, MA', count: 21, percentage: 6.1 },
      { location: 'Other', count: 33, percentage: 9.6 }
    ],
    joinedTimeline: [
      { period: 'Jan 2024', count: 45 },
      { period: 'Feb 2024', count: 62 },
      { period: 'Mar 2024', count: 78 },
      { period: 'Apr 2024', count: 89 },
      { period: 'May 2024', count: 70 }
    ],
    preferences: [
      { category: 'Live Music', interest_level: 85, count: 292 },
      { category: 'Nightlife', interest_level: 78, count: 268 },
      { category: 'Food & Drink', interest_level: 72, count: 247 },
      { category: 'Arts & Culture', interest_level: 65, count: 223 },
      { category: 'Sports', interest_level: 45, count: 154 }
    ]
  };

  const handleExport = async (options: any) => {
    // Mock export function - in real implementation would call API
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Exporting with options:', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Follower Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your follower base and engagement
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          {followerCount.toLocaleString()} total followers
        </div>
      </div>

      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Growth
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth Tracking</CardTitle>
              <CardDescription>
                Monitor how your follower base grows over time with detailed acquisition and retention metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FollowerGrowthChart 
                data={growthData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Track which content resonates most with your followers and drives the highest engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EngagementMetrics 
                engagementData={engagementData}
                topContent={topContent}
                totalEngagement={totalEngagement}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Demographic Analytics</CardTitle>
              <CardDescription>
                Understand your audience demographics, preferences, and geographic distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemographicAnalytics 
                demographicData={demographicData}
                totalFollowers={followerCount}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Capabilities</CardTitle>
              <CardDescription>
                Export your follower data in various formats for external analysis and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FollowerDataExport 
                promoterId={promoterId}
                totalFollowers={followerCount}
                onExport={handleExport}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerAnalyticsDashboard;
