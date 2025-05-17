
import React from 'react';
import { useFollowing } from '@/hooks/useFollowing';
import FollowCard from './FollowCard';

interface NotificationPreferences {
  events: boolean;
  promotions: boolean;
  announcements: boolean;
}

interface FollowersListProps {
  promoterId: string;
  promoterName: string;
}

const FollowersList: React.FC<FollowersListProps> = ({ promoterId, promoterName }) => {
  const { followers, followedPromoters, isLoading } = useFollowing(promoterId);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading followers...</div>;
  }

  const currentFollower = followedPromoters.find(
    (follower) => follower.promoter_id === promoterId
  );
  
  const isFollowing = !!currentFollower;
  
  // Process notification preferences to ensure they match the expected format
  let notificationPreferences: NotificationPreferences | undefined;
  
  if (currentFollower?.notification_preferences) {
    try {
      // If it's a string (JSON), try to parse it
      if (typeof currentFollower.notification_preferences === 'string') {
        notificationPreferences = JSON.parse(
          currentFollower.notification_preferences as string
        ) as NotificationPreferences;
      } 
      // If it's already an object, use it directly
      else if (typeof currentFollower.notification_preferences === 'object') {
        notificationPreferences = {
          events: Boolean(currentFollower.notification_preferences?.events ?? true),
          promotions: Boolean(currentFollower.notification_preferences?.promotions ?? true),
          announcements: Boolean(currentFollower.notification_preferences?.announcements ?? true)
        };
      }
    } catch (e) {
      // If parsing fails, use default values
      console.error('Failed to parse notification preferences', e);
      notificationPreferences = {
        events: true,
        promotions: true,
        announcements: true
      };
    }
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      <FollowCard
        promoterId={promoterId}
        promoterName={promoterName}
        isFollowing={isFollowing}
        currentFollowerId={currentFollower?.id}
        notificationPreferences={notificationPreferences}
      />
      
      {isFollowing && (
        <div className="bg-muted/20 p-4 rounded-lg border">
          <h3 className="font-medium mb-2">You're following {promoterName}</h3>
          <p className="text-sm text-muted-foreground">
            You'll receive updates about new events, promotions, and announcements.
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowersList;
