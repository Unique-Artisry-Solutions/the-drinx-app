
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar, Bell } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerAnalyticsProps } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';

// Type guard for notification preferences
const hasNotificationPreferences = (follower: any): follower is { notification_preferences: { events?: boolean } } => {
  return follower && 
         typeof follower === 'object' && 
         'notification_preferences' in follower &&
         typeof follower.notification_preferences === 'object' &&
         follower.notification_preferences !== null;
};

const FollowerAnalyticsWidgets: React.FC<FollowerAnalyticsProps> = ({ 
  promoterId,
  detailed = false,
  timeRange = 'month',
  metrics = ['total', 'growth', 'engagement'],
  className = '',
  onError,
  onSuccess
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  React.useEffect(() => {
    if (followers && onSuccess) {
      onSuccess({ followers, count: followers.length });
    }
  }, [followers, onSuccess]);

  const handleError = (error: Error) => {
    console.error('FollowerAnalyticsWidgets error:', error);
    onError?.(error);
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const recentFollowers = followers?.filter(f => {
    const createdAt = new Date(f.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdAt > thirtyDaysAgo;
  }).length || 0;

  const notificationEnabled = followers?.filter(f => {
    if (!hasNotificationPreferences(f)) return false;
    return f.notification_preferences.events !== false;
  }).length || 0;

  const widgets = [
    {
      title: 'Total Followers',
      value: totalFollowers,
      icon: Users,
      change: '+12%',
      description: 'All time followers',
      show: metrics.includes('total')
    },
    {
      title: 'Active Followers',
      value: activeFollowers,
      icon: TrendingUp,
      change: '+8%',
      description: 'Currently following',
      show: metrics.includes('engagement')
    },
    {
      title: 'Recent Growth',
      value: recentFollowers,
      icon: Calendar,
      change: '+24%',
      description: 'Last 30 days',
      show: metrics.includes('growth')
    },
    {
      title: 'Notifications On',
      value: notificationEnabled,
      icon: Bell,
      change: '92%',
      description: 'Receive notifications',
      show: metrics.includes('notifications')
    }
  ].filter(widget => widget.show);

  return (
    <FollowerErrorBoundary onError={handleError}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(widgets.length, 4)} gap-4 ${className}`}>
        {widgets.map((widget, index) => {
          const Icon = widget.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {widget.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{widget.value}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {widget.change}
                  </Badge>
                  <span>{widget.description}</span>
                </div>
                {detailed && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Based on {timeRange} data
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </FollowerErrorBoundary>
  );
};

export default FollowerAnalyticsWidgets;
