
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerAnalyticsDashboardProps {
  promoterId: string;
}

// Type guard for notification preferences
const hasNotificationPreferences = (follower: any): follower is { notification_preferences: { events?: boolean } } => {
  return follower && 
         typeof follower === 'object' && 
         'notification_preferences' in follower &&
         typeof follower.notification_preferences === 'object' &&
         follower.notification_preferences !== null;
};

const FollowerAnalyticsDashboard: React.FC<FollowerAnalyticsDashboardProps> = ({ promoterId }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follower Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const analytics = {
    total: followers?.length || 0,
    active: followers?.filter(f => f.follow_status === 'active').length || 0,
    withNotifications: followers?.filter(f => 
      hasNotificationPreferences(f) && f.notification_preferences.events !== false
    ).length || 0,
    recentJoins: followers?.filter(f => {
      const joinDate = new Date(f.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return joinDate > thirtyDaysAgo;
    }).length || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded">
            <div className="text-2xl font-bold text-blue-600">{analytics.total}</div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl font-bold text-green-600">{analytics.active}</div>
            <div className="text-sm text-muted-foreground">Active Followers</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl font-bold text-purple-600">{analytics.withNotifications}</div>
            <div className="text-sm text-muted-foreground">With Notifications</div>
          </div>
          <div className="text-center p-4 border rounded">
            <div className="text-2xl font-bold text-orange-600">{analytics.recentJoins}</div>
            <div className="text-sm text-muted-foreground">Recent Joins (30d)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerAnalyticsDashboard;
