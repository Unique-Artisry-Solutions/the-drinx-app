
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface EnhancedFollowerListProps {
  promoterId: string;
}

// Type guards for safe property access
const hasPromoterName = (follower: any): follower is { promoter_name?: string } => {
  return follower && typeof follower === 'object' && 'promoter_name' in follower;
};

const hasNotificationPreferences = (follower: any): follower is { notification_preferences: { events?: boolean } } => {
  return follower && 
         typeof follower === 'object' && 
         'notification_preferences' in follower &&
         typeof follower.notification_preferences === 'object' &&
         follower.notification_preferences !== null;
};

const EnhancedFollowerList: React.FC<EnhancedFollowerListProps> = ({ promoterId }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Follower List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading followers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Follower List ({followers?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {followers?.map((follower) => {
            const promoterName = hasPromoterName(follower) ? follower.promoter_name : undefined;
            const hasNotifications = hasNotificationPreferences(follower) && 
                                   follower.notification_preferences.events !== false;

            return (
              <div key={follower.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {promoterName || `Follower ${follower.subscriber_id.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status: {follower.follow_status}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined: {new Date(follower.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      hasNotifications 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hasNotifications ? 'Notifications On' : 'Notifications Off'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {(!followers || followers.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              No followers found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFollowerList;
