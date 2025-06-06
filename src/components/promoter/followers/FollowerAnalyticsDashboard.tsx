
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatDistanceToNow } from 'date-fns';

interface FollowerAnalyticsDashboardProps {
  promoterId: string;
}

const FollowerAnalyticsDashboard: React.FC<FollowerAnalyticsDashboardProps> = ({ promoterId }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['growth', 'engagement']);
  
  const { followers, isLoading } = useSubscriptions(promoterId);

  // Calculate analytics data
  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const recentFollowers = followers?.filter(f => {
    const joinDate = new Date(f.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return joinDate > weekAgo;
  }).length || 0;

  const notificationOptIns = followers?.filter(f => 
    f.notification_preferences?.events === true
  ).length || 0;

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as 'week' | 'month' | 'quarter' | 'year');
  };

  const handleExportAnalytics = () => {
    console.log('Exporting analytics data...');
    // TODO: Implement export functionality
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Follower Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive insights into your follower growth and engagement
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{totalFollowers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Followers</p>
                <p className="text-2xl font-bold">{activeFollowers.toLocaleString()}</p>
                <p className="text-xs text-green-600">
                  {totalFollowers > 0 ? ((activeFollowers / totalFollowers) * 100).toFixed(1) : 0}% active
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Week</p>
                <p className="text-2xl font-bold">{recentFollowers.toLocaleString()}</p>
                <p className="text-xs text-blue-600">
                  +{Math.round((recentFollowers / Math.max(totalFollowers - recentFollowers, 1)) * 100)}% growth
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notification Opt-ins</p>
                <p className="text-2xl font-bold">{notificationOptIns.toLocaleString()}</p>
                <p className="text-xs text-purple-600">
                  {totalFollowers > 0 ? ((notificationOptIns / totalFollowers) * 100).toFixed(1) : 0}% opted in
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Follower Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Growth chart visualization will be implemented here
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">This {timeRange}</span>
                    <span className="text-sm font-medium">+{recentFollowers}</span>
                  </div>
                  <Progress value={(recentFollowers / Math.max(totalFollowers, 1)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active retention</span>
                    <span className="text-sm font-medium">
                      {totalFollowers > 0 ? ((activeFollowers / totalFollowers) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <Progress value={(activeFollowers / Math.max(totalFollowers, 1)) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Engagement Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{notificationOptIns}</p>
                  <p className="text-sm text-muted-foreground">Push Notifications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">-</p>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">-</p>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Follower Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Join Date Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last 7 days</span>
                      <Badge variant="secondary">{recentFollowers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last 30 days</span>
                      <Badge variant="secondary">
                        {followers?.filter(f => {
                          const joinDate = new Date(f.created_at);
                          const monthAgo = new Date();
                          monthAgo.setDate(monthAgo.getDate() - 30);
                          return joinDate > monthAgo;
                        }).length || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {followers?.slice(0, 5).map((follower, index) => (
                  <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">New follower #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {formatDistanceToNow(new Date(follower.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                      {follower.follow_status}
                    </Badge>
                  </div>
                ))}
                
                {followers?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No follower activity yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerAnalyticsDashboard;
