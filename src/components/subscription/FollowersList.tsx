
import React from 'react';
import { useFollowers } from '@/hooks/useFollowers';
import FollowCard from './FollowCard';

interface FollowersListProps {
  promoterId: string;
  promoterName: string;
}

const FollowersList: React.FC<FollowersListProps> = ({ promoterId, promoterName }) => {
  const { followers, followedPromoters, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading followers...</div>;
  }

  const currentFollower = followedPromoters.find(
    (follower) => follower.promoter_id === promoterId
  );
  
  const isFollowing = !!currentFollower;
  
  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      <FollowCard
        promoterId={promoterId}
        promoterName={promoterName}
        isFollowing={isFollowing}
        currentFollowerId={currentFollower?.id}
        notificationPreferences={currentFollower?.notification_preferences}
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
