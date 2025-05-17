
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useFollowers } from '@/hooks/useFollowers';
import { CheckIcon, Bell, BellOff } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";

interface FollowCardProps {
  promoterId: string;
  promoterName: string;
  isFollowing?: boolean;
  currentFollowerId?: string;
  notificationPreferences?: {
    events: boolean;
    promotions: boolean;
    announcements: boolean;
  }
}

export const FollowCard: React.FC<FollowCardProps> = ({
  promoterId,
  promoterName,
  isFollowing = false,
  currentFollowerId,
  notificationPreferences = { events: true, promotions: true, announcements: true }
}) => {
  const { user } = useAuth();
  const { follow, unfollow, updateNotificationPreferences } = useFollowers(promoterId);

  const handleFollowAction = async () => {
    if (isFollowing && currentFollowerId) {
      await unfollow.mutateAsync(currentFollowerId);
    } else {
      await follow.mutateAsync({ promoterId });
    }
  };

  const toggleNotificationPreference = async (type: 'events' | 'promotions' | 'announcements') => {
    if (!currentFollowerId) return;
    
    await updateNotificationPreferences.mutateAsync({
      followerId: currentFollowerId,
      preferences: {
        ...notificationPreferences,
        [type]: !notificationPreferences[type]
      }
    });
  };

  const isLoading = follow.isPending || unfollow.isPending;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{promoterName}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          Follow this promoter to receive updates about their events and promotions.
        </p>
        {isFollowing && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Notification Preferences:</h4>
            <div className="flex flex-col gap-2">
              <Toggle
                pressed={notificationPreferences.events}
                onPressedChange={() => toggleNotificationPreference('events')}
                className="w-full justify-between"
              >
                <span>Events</span>
                {notificationPreferences.events ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Toggle>
              <Toggle
                pressed={notificationPreferences.promotions}
                onPressedChange={() => toggleNotificationPreference('promotions')}
                className="w-full justify-between"
              >
                <span>Promotions</span>
                {notificationPreferences.promotions ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Toggle>
              <Toggle
                pressed={notificationPreferences.announcements}
                onPressedChange={() => toggleNotificationPreference('announcements')}
                className="w-full justify-between"
              >
                <span>Announcements</span>
                {notificationPreferences.announcements ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Toggle>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleFollowAction}
          disabled={!user || isLoading}
          className={isFollowing ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
          variant={isFollowing ? "destructive" : "default"}
        >
          {isLoading
            ? 'Processing...'
            : isFollowing
            ? 'Unfollow'
            : 'Follow'}
          {isFollowing && <CheckIcon className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FollowCard;
