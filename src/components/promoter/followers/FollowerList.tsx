
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import type { FollowerListProps } from '@/types/FollowerComponentTypes';
import type { FollowerData } from '@/hooks/useFollowers';

// Type guards for safe property access
const isFollowerData = (follower: any): follower is FollowerData => {
  return follower && 
         typeof follower === 'object' && 
         'id' in follower && 
         'subscriber_id' in follower &&
         'follow_status' in follower &&
         'created_at' in follower;
};

const hasNotificationPreferences = (follower: any): follower is FollowerData & { notification_preferences: { events: boolean } } => {
  return isFollowerData(follower) && 
         follower.notification_preferences &&
         typeof follower.notification_preferences === 'object' &&
         'events' in follower.notification_preferences;
};

const FollowerList: React.FC<FollowerListProps> = ({ 
  promoterId,
  searchTerm = '',
  filters,
  showActions = false,
  maxItems,
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
    console.error('FollowerList error:', error);
    onError?.(error);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading followers...</div>
        </CardContent>
      </Card>
    );
  }

  // Filter followers based on search term and filters
  let filteredFollowers = followers || [];
  
  if (searchTerm) {
    filteredFollowers = filteredFollowers.filter((follower: any) => {
      if (!isFollowerData(follower)) return false;
      const promoterName = follower.promoter_name || '';
      const subscriberId = follower.subscriber_id || '';
      return promoterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             subscriberId.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  if (filters?.status) {
    filteredFollowers = filteredFollowers.filter((follower: any) => 
      isFollowerData(follower) && follower.follow_status === filters.status
    );
  }

  if (filters?.notificationsEnabled !== undefined) {
    filteredFollowers = filteredFollowers.filter((follower: any) => {
      if (!hasNotificationPreferences(follower)) return !filters.notificationsEnabled;
      return filters.notificationsEnabled ? 
        follower.notification_preferences.events !== false : 
        follower.notification_preferences.events === false;
    });
  }

  if (maxItems) {
    filteredFollowers = filteredFollowers.slice(0, maxItems);
  }

  try {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Followers ({filteredFollowers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFollowers.map((follower: any) => {
              if (!isFollowerData(follower)) return null;
              
              const promoterName = follower.promoter_name || `Follower ${follower.subscriber_id.slice(0, 8)}...`;
              const hasNotifications = hasNotificationPreferences(follower) && 
                                     follower.notification_preferences.events !== false;

              return (
                <div key={follower.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{promoterName}</div>
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
                      {follower.tier_name && (
                        <Badge variant="secondary" className="text-xs">
                          {follower.tier_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredFollowers.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No followers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    handleError(error as Error);
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error loading followers
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default FollowerList;
