
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Calendar,
  Bell,
  Heart,
  Crown,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import FollowerAnalyticsWidgets from './FollowerAnalyticsWidgets';
import FollowerGrowthChart from './analytics/FollowerGrowthChart';
import { FollowerAnalyticsProps, FollowerAnalyticsData } from '@/types/FollowerComponentTypes';

const FollowerAnalyticsDashboard: React.FC<FollowerAnalyticsProps> = ({
  promoterId,
  detailed = true,
  timeRange = 'month',
  metrics = ['total', 'growth', 'engagement', 'notifications'],
  className = '',
  onError,
  onSuccess
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock growth data for demonstration
  const generateGrowthData = (days: number) => {
    const data = [];
    const baseCount = followers?.length || 0;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const newFollowers = Math.floor(Math.random() * 10) + 1;
      const unfollowers = Math.floor(Math.random() * 3);
      const totalFollowers = Math.max(0, baseCount - (i * 2) + (Math.random() * 20));
      
      data.push({
        date: date.toISOString().split('T')[0],
        newFollowers,
        totalFollowers: Math.floor(totalFollowers),
        unfollowers
      });
    }
    
    return data;
  };

  const growthData = generateGrowthData(selectedTimeRange === '7d' ? 7 : 
                                      selectedTimeRange === '30d' ? 30 :
                                      selectedTimeRange === '90d' ? 90 : 365);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting analytics data in ${format} format`);
  };

  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const freeFollowers = followers?.filter(f => !f.tier_id).length || 0;
  const premiumFollowers = followers?.filter(f => f.tier_id).length || 0;
  const notificationEnabled = followers?.filter(f => 
    f.notification_preferences?.events !== false
  ).length || 0;

  // Calculate engagement metrics
  const engagementRate = totalFollowers > 0 ? ((activeFollowers / totalFollowers) * 100).toFixed(1) : '0';
  const notificationOptInRate = totalFollowers > 0 ? ((notificationEnabled / totalFollowers) * 100).toFixed(1) : '0';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Follower Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your follower base</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Widgets */}
      <FollowerAnalyticsWidgets
        promoterId={promoterId}
        detailed={detailed}
        timeRange={timeRange}
        metrics={metrics}
        onError={onError}
        onSuccess={onSuccess}
      />

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Key Metrics Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFollowers}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+12%</Badge>
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{engagementRate}%</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+3%</Badge>
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notification Opt-in</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationOptInRate}%</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+5%</Badge>
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Ratio</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalFollowers > 0 ? ((premiumFollowers / totalFollowers) * 100).toFixed(1) : '0'}%
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">+8%</Badge>
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Follower Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follower Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-500" />
                      <span>Free Followers</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{freeFollowers}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalFollowers > 0 ? ((freeFollowers / totalFollowers) * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-purple-500" />
                      <span>Premium Followers</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{premiumFollowers}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalFollowers > 0 ? ((premiumFollowers / totalFollowers) * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-500" />
                      <span>Notifications Enabled</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{notificationEnabled}</div>
                      <div className="text-xs text-muted-foreground">{notificationOptInRate}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New followers today</span>
                    <Badge variant="secondary">+{Math.floor(Math.random() * 10) + 1}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Messages sent this week</span>
                    <Badge variant="secondary">{Math.floor(Math.random() * 50) + 10}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. engagement rate</span>
                    <Badge variant="secondary">{engagementRate}%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Growth rate (30d)</span>
                    <Badge variant="secondary">+12.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <FollowerGrowthChart
            data={growthData}
            timeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
          />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Message open rate</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Click-through rate</span>
                    <span className="font-semibold">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Event attendance rate</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg. session duration</span>
                    <span className="font-semibold">4m 32s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Summer Circuit Launch</div>
                    <div className="text-xs text-muted-foreground">85% engagement rate</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Happy Hour Promotion</div>
                    <div className="text-xs text-muted-foreground">72% engagement rate</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Weekend Event Alert</div>
                    <div className="text-xs text-muted-foreground">68% engagement rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">18-24</span>
                    <span className="text-sm font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">25-34</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">35-44</span>
                    <span className="text-sm font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">45+</span>
                    <span className="text-sm font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Local (< 10 miles)</span>
                    <span className="text-sm font-semibold">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Regional (< 50 miles)</span>
                    <span className="text-sm font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">National</span>
                    <span className="text-sm font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interest Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Nightlife</span>
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Live Music</span>
                    <span className="text-sm font-semibold">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Food & Dining</span>
                    <span className="text-sm font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Social Events</span>
                    <span className="text-sm font-semibold">58%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerAnalyticsDashboard;
