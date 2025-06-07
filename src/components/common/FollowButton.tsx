
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Heart, UserPlus, UserMinus, Bell, BellOff } from 'lucide-react';
import type { FollowerData, FollowerPreferences } from '@/types/FollowerComponentTypes';

interface FollowButtonProps {
  promoterId: string;
  promoterName?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  showFollowerCount?: boolean;
  showNotificationToggle?: boolean;
  className?: string;
}

// Type guard to safely check if an object is FollowerData
const isFollowerData = (obj: any): obj is FollowerData => {
  return obj && 
         typeof obj === 'object' && 
         'id' in obj && 
         'promoter_id' in obj;
};

// Helper function to safely get notification preferences
const getNotificationPreferences = (obj: any): FollowerPreferences | null => {
  if (!obj || typeof obj !== 'object') return null;
  
  if ('notification_preferences' in obj && obj.notification_preferences) {
    if (typeof obj.notification_preferences === 'object') {
      return obj.notification_preferences as FollowerPreferences;
    }
  }
  
  if ('preferences' in obj && obj.preferences) {
    if (typeof obj.preferences === 'object') {
      return obj.preferences as FollowerPreferences;
    }
  }
  
  return null;
};

const FollowButton: React.FC<FollowButtonProps> = ({
  promoterId,
  promoterName = 'promoter',
  variant = 'default',
  size = 'default',
  showFollowerCount = false,
  showNotificationToggle = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { subscriptions, followers, follow, unfollow, updatePreferences } = useSubscriptions(promoterId);

  // Check if currently following with proper type checking
  const currentSubscription = subscriptions.find((sub: any) => 
    isFollowerData(sub) && sub.promoter_id === promoterId
  );
  const isFollowing = !!currentSubscription;
  
  const preferences = isFollowerData(currentSubscription) ? getNotificationPreferences(currentSubscription) : null;
  const hasNotifications = preferences?.events !== false;

  const handleFollowToggle = async () => {
    try {
      if (isFollowing && isFollowerData(currentSubscription)) {
        await unfollow.mutateAsync({ promoterId });
      } else {
        await follow.mutateAsync({ promoterId });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isFollowing ? 'unfollow' : 'follow'} ${promoterName}`,
        variant: 'destructive'
      });
    }
  };

  const handleNotificationToggle = async () => {
    if (!isFollowerData(currentSubscription)) return;

    try {
      const currentPrefs = getNotificationPreferences(currentSubscription) || {
        events: true,
        promotions: true,
        generalUpdates: true,
        email: true,
        push: false
      };

      await updatePreferences.mutateAsync({
        followerId: currentSubscription.id,
        preferences: {
          ...currentPrefs,
          events: !hasNotifications
        }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive'
      });
    }
  };

  const getButtonContent = () => {
    if (variant === 'compact') {
      return isFollowing ? (
        <Heart className={`h-4 w-4 ${isHovered ? 'text-red-500' : 'text-red-500 fill-current'}`} />
      ) : (
        <UserPlus className="h-4 w-4" />
      );
    }

    if (isFollowing) {
      return (
        <>
          {isHovered ? (
            <>
              <UserMinus className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              Following
            </>
          )}
        </>
      );
    }

    return (
      <>
        <UserPlus className="h-4 w-4" />
        Follow
      </>
    );
  };

  const getButtonVariant = () => {
    if (variant === 'compact') {
      return isFollowing ? 'ghost' : 'outline';
    }
    
    if (isFollowing && isHovered) {
      return 'destructive';
    }
    
    return isFollowing ? 'outline' : variant;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleFollowToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={follow.isPending || unfollow.isPending}
        className={variant === 'compact' ? 'px-3' : ''}
      >
        {getButtonContent()}
      </Button>

      {showFollowerCount && followers.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {followers.length.toLocaleString()} followers
        </Badge>
      )}

      {showNotificationToggle && isFollowing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotificationToggle}
          disabled={updatePreferences.isPending}
          className="px-2"
        >
          {hasNotifications ? (
            <Bell className="h-4 w-4 text-blue-500" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      )}
    </div>
  );
};

export default FollowButton;
