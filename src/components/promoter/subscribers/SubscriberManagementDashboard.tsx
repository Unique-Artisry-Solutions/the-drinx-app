
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface SubscriberManagementDashboardProps {
  promoterId: string;
}

// Type guards for safe property access
const hasTierId = (subscriber: any): subscriber is { tier_id: string | null; tier_name?: string | null } => {
  return subscriber && typeof subscriber === 'object' && 'tier_id' in subscriber;
};

const hasNotificationPreferences = (subscriber: any): subscriber is { notification_preferences: { events?: boolean } } => {
  return subscriber && 
         typeof subscriber === 'object' && 
         'notification_preferences' in subscriber &&
         typeof subscriber.notification_preferences === 'object' &&
         subscriber.notification_preferences !== null;
};

const hasSubscriptionStart = (subscriber: any): subscriber is { subscription_start: string } => {
  return subscriber && typeof subscriber === 'object' && 'subscription_start' in subscriber;
};

const SubscriberManagementDashboard: React.FC<SubscriberManagementDashboardProps> = ({ promoterId }) => {
  const { followers: subscribers, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading subscribers...</div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: subscribers?.length || 0,
    premium: subscribers?.filter(s => hasTierId(s) && s.tier_id).length || 0,
    free: subscribers?.filter(s => !hasTierId(s) || !s.tier_id).length || 0,
    withNotifications: subscribers?.filter(s => 
      hasNotificationPreferences(s) && s.notification_preferences.events !== false
    ).length || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Management Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Subscribers</div>
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
          {subscribers?.slice(0, 5).map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">
                  Subscriber {subscriber.subscriber_id.slice(0, 8)}...
                </div>
                <div className="text-sm text-muted-foreground">
                  {hasSubscriptionStart(subscriber) && (
                    <span>
                      Joined: {new Date(subscriber.subscription_start).toLocaleDateString()}
                    </span>
                  )}
                  {hasTierId(subscriber) && subscriber.tier_id && (
                    <span className="ml-2">
                      Tier: {subscriber.tier_name || 'Premium'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasNotificationPreferences(subscriber) && 
                 subscriber.notification_preferences.events !== false && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Notifications On
                  </span>
                )}
                {hasNotificationPreferences(subscriber) && 
                 subscriber.notification_preferences.events === false && (
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

export default SubscriberManagementDashboard;
