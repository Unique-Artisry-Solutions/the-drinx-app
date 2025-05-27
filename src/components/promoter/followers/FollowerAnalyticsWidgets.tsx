
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Bell,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';

interface FollowerAnalyticsWidgetsProps {
  promoterId: string;
  detailed?: boolean;
}

const FollowerAnalyticsWidgets: React.FC<FollowerAnalyticsWidgetsProps> = ({ 
  promoterId, 
  detailed = false 
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  // Mock analytics data - in real implementation, this would come from API
  const analytics = {
    totalFollowers: followers?.length || 0,
    growthRate: 12.5,
    engagementRate: 87.3,
    activeFollowers: Math.floor((followers?.length || 0) * 0.87),
    notificationsEnabled: Math.floor((followers?.length || 0) * 0.92),
    weeklyGrowth: [
      { name: 'Mon', value: 12 },
      { name: 'Tue', value: 19 },
      { name: 'Wed', value: 8 },
      { name: 'Thu', value: 15 },
      { name: 'Fri', value: 22 },
      { name: 'Sat', value: 28 },
      { name: 'Sun', value: 18 }
    ],
    followerSources: [
      { name: 'Event Discovery', value: 45, color: '#3B82F6' },
      { name: 'Social Sharing', value: 30, color: '#10B981' },
      { name: 'Direct Search', value: 15, color: '#F59E0B' },
      { name: 'Recommendations', value: 10, color: '#EF4444' }
    ]
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Followers",
      value: analytics.totalFollowers.toLocaleString(),
      icon: Users,
      iconColor: "text-blue-500",
      change: analytics.growthRate,
      changeType: analytics.growthRate > 0 ? 'positive' : 'negative'
    },
    {
      title: "Active Followers",
      value: analytics.activeFollowers.toLocaleString(),
      icon: Heart,
      iconColor: "text-red-500",
      change: 5.2,
      changeType: 'positive'
    },
    {
      title: "Engagement Rate",
      value: `${analytics.engagementRate}%`,
      icon: MessageSquare,
      iconColor: "text-green-500",
      change: 2.8,
      changeType: 'positive'
    },
    {
      title: "Notifications On",
      value: analytics.notificationsEnabled.toLocaleString(),
      icon: Bell,
      iconColor: "text-purple-500",
      change: -1.2,
      changeType: 'negative'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                <Badge 
                  variant={metric.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics (shown when detailed=true) */}
      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsLineChart
                data={analytics.weeklyGrowth}
                height={200}
                series={[{ key: 'value', name: 'New Followers', color: '#3B82F6' }]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Follower Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsPieChart
                data={analytics.followerSources}
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Engagement Insights */}
      {detailed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Engagement Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">4.2</div>
                <div className="text-sm text-muted-foreground">Avg. Event Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">78%</div>
                <div className="text-sm text-muted-foreground">Event Attendance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">92%</div>
                <div className="text-sm text-muted-foreground">Notification Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowerAnalyticsWidgets;
