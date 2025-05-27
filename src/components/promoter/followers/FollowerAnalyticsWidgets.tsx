
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  UserPlus,
  Bell,
  BarChart3
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerAnalyticsProps } from '@/types/FollowerComponentTypes';
import { FollowerAnalyticsSkeleton } from './FollowerLoadingStates';
import FollowerErrorBoundary from './FollowerErrorBoundary';

const FollowerAnalyticsWidgets: React.FC<FollowerAnalyticsProps> = ({ 
  promoterId,
  detailed = false,
  timeRange = 'month',
  metrics = ['total', 'growth', 'engagement'],
  className = '',
  onError,
  onSuccess
}) => {
  const { followers, isLoading, error } = useSubscriptions(promoterId);

  React.useEffect(() => {
    if (error && onError) {
      onError(new Error(error));
    }
  }, [error, onError]);

  React.useEffect(() => {
    if (followers && onSuccess) {
      onSuccess({ followers, count: followers.length });
    }
  }, [followers, onSuccess]);

  if (isLoading) {
    return <FollowerAnalyticsSkeleton detailed={detailed} />;
  }

  if (error) {
    throw new Error(error);
  }

  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const notificationEnabledFollowers = followers?.filter(f => 
    f.notification_preferences?.events !== false
  ).length || 0;

  // Mock growth data - in real app this would come from analytics
  const growthRate = 12; // percentage
  const newThisMonth = Math.floor(totalFollowers * 0.15);

  const widgets = [
    {
      title: 'Total Followers',
      value: totalFollowers.toLocaleString(),
      icon: Users,
      trend: `+${growthRate}% this ${timeRange}`,
      color: 'text-blue-600',
      show: metrics.includes('total')
    },
    {
      title: 'Active Followers',
      value: activeFollowers.toLocaleString(),
      icon: TrendingUp,
      trend: `${Math.round((activeFollowers / totalFollowers) * 100)}% active rate`,
      color: 'text-green-600',
      show: metrics.includes('engagement')
    },
    {
      title: 'New This Month',
      value: newThisMonth.toLocaleString(),
      icon: UserPlus,
      trend: `+${Math.round((newThisMonth / totalFollowers) * 100)}% of total`,
      color: 'text-purple-600',
      show: metrics.includes('growth')
    },
    {
      title: 'Notifications Enabled',
      value: notificationEnabledFollowers.toLocaleString(),
      icon: Bell,
      trend: `${Math.round((notificationEnabledFollowers / totalFollowers) * 100)}% opt-in rate`,
      color: 'text-orange-600',
      show: metrics.includes('engagement')
    }
  ];

  const visibleWidgets = widgets.filter(widget => widget.show);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleWidgets.map((widget, index) => {
          const IconComponent = widget.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${widget.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{widget.value}</div>
                <p className="text-xs text-muted-foreground">{widget.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {detailed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Follower Status</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Active</span>
                      <Badge variant="default">{activeFollowers}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paused</span>
                      <Badge variant="secondary">
                        {followers?.filter(f => f.follow_status === 'paused').length || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cancelled</span>
                      <Badge variant="outline">
                        {followers?.filter(f => f.follow_status === 'cancelled').length || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Engagement</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Event Notifications</span>
                      <Badge variant="default">{notificationEnabledFollowers}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Opt-out Rate</span>
                      <Badge variant="secondary">
                        {Math.round(((totalFollowers - notificationEnabledFollowers) / totalFollowers) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Growth Metrics</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Growth Rate</span>
                      <Badge variant="default">+{growthRate}%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Retention</span>
                      <Badge variant="default">
                        {Math.round((activeFollowers / totalFollowers) * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowerAnalyticsWidgets;
