
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerManagementDashboardProps {
  promoterId: string;
}

// Type guards for safe property access
const hasTierId = (follower: any): follower is { tier_id: string | null; tier_name?: string | null } => {
  return follower && typeof follower === 'object' && 'tier_id' in follower;
};

const hasNotificationPreferences = (follower: any): follower is { notification_preferences: { events?: boolean } } => {
  return follower && 
         typeof follower === 'object' && 
         'notification_preferences' in follower &&
         typeof follower.notification_preferences === 'object' &&
         follower.notification_preferences !== null;
};

const hasSubscriptionStart = (follower: any): follower is { subscription_start: string } => {
  return follower && typeof follower === 'object' && 'subscription_start' in follower;
};

const FollowerManagementDashboard: React.FC<FollowerManagementDashboardProps> = ({ promoterId }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follower Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading followers...</div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: followers?.length || 0,
    premium: followers?.filter(f => hasTierId(f) && f.tier_id).length || 0,
    free: followers?.filter(f => !hasTierId(f) || !f.tier_id).length || 0,
    withNotifications: followers?.filter(f => 
      hasNotificationPreferences(f) && f.notification_preferences.events !== false
    ).length || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Management Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.premium}</div>
            <div className="text-sm text-muted-foreground">Premium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.free}</div>
            <div className="text-sm text-muted-foreground">Free</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.withNotifications}</div>
            <div className="text-sm text-muted-foreground">Notifications On</div>
          </div>
        </div>

        <div className="space-y-2">
          {followers?.slice(0, 5).map((follower) => (
            <div key={follower.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">
                  Follower {follower.subscriber_id.slice(0, 8)}...
                </div>
                <div className="text-sm text-muted-foreground">
                  {hasSubscriptionStart(follower) && (
                    <span>
                      Joined: {new Date(follower.subscription_start).toLocaleDateString()}
                    </span>
                  )}
                  {hasTierId(follower) && follower.tier_id && (
                    <span className="ml-2">
                      Tier: {follower.tier_name || 'Premium'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasNotificationPreferences(follower) && 
                 follower.notification_preferences.events !== false && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Notifications On
                  </span>
                )}
                {hasNotificationPreferences(follower) && 
                 follower.notification_preferences.events === false && (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Notifications Off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerManagementDashboard;
