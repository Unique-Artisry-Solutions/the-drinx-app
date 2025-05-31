import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target } from 'lucide-react';

// Mock analytics data - preserved as placeholder
const mockSegmentAnalytics = {
  totalSegments: 12,
  activeSegments: 8,
  totalUsers: 15678,
  avgEngagement: 73.2,
  segments: [
    { id: '1', name: 'High Engagement Users', size: 3456, growth: 12.5, engagement: 85.2 },
    { id: '2', name: 'New Subscribers', size: 2890, growth: 22.1, engagement: 67.8 },
    { id: '3', name: 'VIP Members', size: 1234, growth: 8.3, engagement: 92.4 },
    { id: '4', name: 'Regular Visitors', size: 4567, growth: 15.7, engagement: 71.9 }
  ],
  trends: [
    { month: 'Jan', segments: 8, users: 12000, engagement: 68.5 },
    { month: 'Feb', segments: 9, users: 13200, engagement: 71.2 },
    { month: 'Mar', segments: 10, users: 14100, engagement: 72.8 },
    { month: 'Apr', segments: 11, users: 14900, engagement: 73.1 },
    { month: 'May', segments: 12, users: 15678, engagement: 73.2 }
  ]
};

interface AudienceInsightsProps {
  selectedSegments?: string[];
}

export function AudienceInsights({ selectedSegments = [] }: AudienceInsightsProps) {
  const [_activeTab, setActiveTab] = useState('overview');

  // Analytics data - using mock data as placeholder
  const analytics = mockSegmentAnalytics;

  const filteredSegments = selectedSegments.length > 0
    ? analytics.segments.filter(segment => selectedSegments.includes(segment.id))
    : analytics.segments;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSegments}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 this month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1,578 this month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgEngagement}%</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% this month
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={_activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSegments.map((segment) => (
                  <div key={segment.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{segment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {segment.size.toLocaleString()} users
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{segment.engagement}% engaged</Badge>
                      <p className="text-sm text-green-600 mt-1">
                        +{segment.growth}% growth
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSegments.map((segment) => (
                  <div key={segment.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{segment.name}</span>
                      <span className="text-sm text-muted-foreground">{segment.engagement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${segment.engagement}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.trends.map((trend, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">{trend.month}</span>
                    <div className="text-right">
                      <div className="text-sm">{trend.segments} segments</div>
                      <div className="text-sm text-muted-foreground">{trend.users.toLocaleString()} users</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
