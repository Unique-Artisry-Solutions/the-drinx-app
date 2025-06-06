
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface FollowerCommunicationHubProps {
  promoterId: string;
}

// Type guards for safe property access
const hasTierId = (follower: any): follower is { tier_id: string | null } => {
  return follower && typeof follower === 'object' && 'tier_id' in follower;
};

const hasNotificationPreferences = (follower: any): follower is { notification_preferences: { events?: boolean } } => {
  return follower && 
         typeof follower === 'object' && 
         'notification_preferences' in follower &&
         typeof follower.notification_preferences === 'object' &&
         follower.notification_preferences !== null;
};

const FollowerCommunicationHub: React.FC<FollowerCommunicationHubProps> = ({ promoterId }) => {
  const { followers, sendNotification } = useSubscriptions(promoterId);

  const segments = {
    all: followers || [],
    premium: followers?.filter(f => hasTierId(f) && f.tier_id) || [],
    free: followers?.filter(f => !hasTierId(f) || !f.tier_id) || [],
    withNotifications: followers?.filter(f => 
      hasNotificationPreferences(f) && f.notification_preferences.events !== false
    ) || []
  };

  const handleSendToSegment = async (segmentName: string, segmentFollowers: any[]) => {
    try {
      // Send to first follower as example - in real implementation, this would send to all
      const firstFollower = segmentFollowers[0];
      if (firstFollower) {
        await sendNotification.mutateAsync({
          followerId: firstFollower.id,
          message: `Message to ${segmentName} followers`
        });
      }
      console.log(`Sent message to ${segmentName} segment (${segmentFollowers.length} followers)`);
    } catch (error) {
      console.error(`Failed to send message to ${segmentName}:`, error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Communication Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Send to Segments</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSendToSegment('all', segments.all)}
                className="w-full"
              >
                All Followers ({segments.all.length})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSendToSegment('premium', segments.premium)}
                className="w-full"
              >
                Premium ({segments.premium.length})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSendToSegment('free', segments.free)}
                className="w-full"
              >
                Free ({segments.free.length})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleSendToSegment('notification-enabled', segments.withNotifications)}
                className="w-full"
              >
                Notifications On ({segments.withNotifications.length})
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Follower Insights</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Followers:</span>
                <span className="font-medium">{segments.all.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Followers:</span>
                <span className="font-medium">
                  {segments.all.filter(f => f.follow_status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>With Notifications:</span>
                <span className="font-medium">
                  {segments.withNotifications.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerCommunicationHub;
