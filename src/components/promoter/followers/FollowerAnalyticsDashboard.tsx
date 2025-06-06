
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Heart,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { FollowerAnalyticsProps } from '@/types/FollowerComponentTypes';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';

export const FollowerAnalyticsDashboard: React.FC<FollowerAnalyticsProps> = ({ 
  promoterId,
  className = '',
  timeRange = 'month',
  onError,
  onSuccess
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real implementation, this would come from API
  const mockAnalytics = {
    overview: {
      totalFollowers: 1247,
      activeFollowers: 892,
      newThisWeek: 23,
      engagementRate: 67.8,
      topLocation: 'Downtown',
      averageAge: 28
    },
    growth: [
      { date: '2024-01-01', followers: 1100, newFollowers: 45, unfollowers: 12 },
      { date: '2024-01-08', followers: 1133, newFollowers: 38, unfollowers: 5 },
      { date: '2024-01-15', followers: 1166, newFollowers: 42, unfollowers: 9 },
      { date: '2024-01-22', followers: 1199, newFollowers: 51, unfollowers: 18 },
      { date: '2024-01-29', followers: 1232, newFollowers: 48, unfollowers: 15 },
      { date: '2024-02-05', followers: 1247, newFollowers: 23, unfollowers: 8 }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', count: 312, percentage: 25 },
        { range: '25-34', count: 436, percentage: 35 },
        { range: '35-44', count: 287, percentage: 23 },
        { range: '45+', count: 212, percentage: 17 }
      ],
      locations: [
        { city: 'Downtown', count: 445, percentage: 36 },
        { city: 'Midtown', count: 324, percentage: 26 },
        { city: 'Uptown', count: 278, percentage: 22 },
        { city: 'Suburbs', count: 200, percentage: 16 }
      ]
    },
    engagement: {
      totalInteractions: 3421,
      averageEngagement: 67.8,
      topContent: [
        { title: 'Summer Circuit Launch', interactions: 234, reach: 892 },
        { title: 'Happy Hour Special', interactions: 189, reach: 567 },
        { title: 'Weekend Event', interactions: 156, reach: 445 }
      ]
    }
  };

  const handleExport = (format: string) => {
    console.log(`Exporting analytics data in ${format} format`);
    onSuccess?.({ message: `Analytics exported as ${format}` });
  };

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Total Followers"
          value={mockAnalytics.overview.totalFollowers.toLocaleString()}
          icon={Users}
          iconColor="text-blue-500"
          change={12}
        />
        <AnalyticsMetricCard
          title="Active Followers"
          value={mockAnalytics.overview.activeFollowers.toLocaleString()}
          icon={Activity}
          iconColor="text-green-500"
          change={8}
        />
        <AnalyticsMetricCard
          title="New This Week"
          value={mockAnalytics.overview.newThisWeek.toString()}
          icon={TrendingUp}
          iconColor="text-purple-500"
          change={15}
        />
        <AnalyticsMetricCard
          title="Engagement Rate"
          value={`${mockAnalytics.overview.engagementRate}%`}
          icon={Heart}
          iconColor="text-red-500"
          change={5}
        />
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mockAnalytics.overview.topLocation}
              </div>
              <div className="text-sm text-blue-600">Top Location</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.overview.averageAge}
              </div>
              <div className="text-sm text-green-600">Average Age</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(mockAnalytics.overview.totalFollowers / 30)}
              </div>
              <div className="text-sm text-purple-600">Daily Average</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GrowthTab = () => (
    <div className="space-y-6">
      {/* Growth Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Follower Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Growth chart would be rendered here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{mockAnalytics.growth[mockAnalytics.growth.length - 1].newFollowers}</div>
              <div className="text-sm text-gray-600">New This Week</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(mockAnalytics.growth.reduce((acc, curr) => acc + curr.newFollowers, 0) / mockAnalytics.growth.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Weekly Growth</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((mockAnalytics.overview.totalFollowers - 1100) / 1100 * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Total Growth</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const DemographicsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.demographics.ageGroups.map((group) => (
                <div key={group.range} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{group.range}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{group.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.demographics.locations.map((location) => (
                <div key={location.city} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{location.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{location.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const EngagementTab = () => (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsMetricCard
          title="Total Interactions"
          value={mockAnalytics.engagement.totalInteractions.toLocaleString()}
          icon={MessageSquare}
          iconColor="text-blue-500"
          change={18}
        />
        <AnalyticsMetricCard
          title="Avg Engagement"
          value={`${mockAnalytics.engagement.averageEngagement}%`}
          icon={Activity}
          iconColor="text-green-500"
          change={12}
        />
        <AnalyticsMetricCard
          title="Top Content Reach"
          value={mockAnalytics.engagement.topContent[0]?.reach.toString() || '0'}
          icon={TrendingUp}
          iconColor="text-purple-500"
          change={25}
        />
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAnalytics.engagement.topContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{content.title}</div>
                  <div className="text-sm text-gray-600">
                    {content.interactions} interactions • {content.reach} reach
                  </div>
                </div>
                <Badge variant="outline">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Follower Analytics</h2>
          <p className="text-gray-600">Detailed insights into your follower base</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <GrowthTab />
        </TabsContent>

        <TabsContent value="demographics" className="mt-6">
          <DemographicsTab />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <EngagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerAnalyticsDashboard;
