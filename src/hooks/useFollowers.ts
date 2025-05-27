
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FollowerService, type FollowRequest, type FollowerNotification } from '@/services/FollowerService';
import { useToast } from '@/hooks/use-toast';
import type { NotificationPreferences } from '@/types/SubscriptionTypes';

export function useFollowers(promoterId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get user's followed promoters
  const userFollows = useQuery({
    queryKey: ['user-follows'],
    queryFn: () => FollowerService.getUserFollows(),
    enabled: !promoterId // Only fetch when not looking at a specific promoter
  });

  // Get followers for a specific promoter
  const promoterFollowers = useQuery({
    queryKey: ['promoter-followers', promoterId],
    queryFn: () => FollowerService.getPromoterFollowers(promoterId!),
    enabled: !!promoterId
  });

  // Follow a promoter (free)
  const follow = useMutation({
    mutationFn: (promoterId: string) => FollowerService.followPromoter(promoterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Successfully followed!',
        description: 'You are now following this promoter and will receive their updates.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to follow',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Subscribe to a premium tier
  const subscribe = useMutation({
    mutationFn: ({ promoterId, tierId }: { promoterId: string; tierId: string }) => 
      FollowerService.subscribeToTier(promoterId, tierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Successfully subscribed!',
        description: 'You now have access to premium features and content.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to subscribe',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Unfollow/unsubscribe
  const unfollow = useMutation({
    mutationFn: (subscriptionId: string) => FollowerService.unfollowPromoter(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
      toast({
        title: 'Successfully unfollowed',
        description: 'You will no longer receive updates from this promoter.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to unfollow',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Send notification to followers
  const sendNotification = useMutation({
    mutationFn: ({ 
      promoterId, 
      notification, 
      targetTiers 
    }: { 
      promoterId: string; 
      notification: FollowerNotification; 
      targetTiers?: string[] 
    }) => FollowerService.sendNotificationToFollowers(promoterId, notification, targetTiers),
    onSuccess: () => {
      toast({
        title: 'Notification sent!',
        description: 'Your message has been sent to your followers.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send notification',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Send flyer to followers
  const sendFlyer = useMutation({
    mutationFn: ({ 
      promoterId, 
      flyerUrl, 
      title, 
      description, 
      targetTiers 
    }: { 
      promoterId: string; 
      flyerUrl: string; 
      title: string; 
      description: string; 
      targetTiers?: string[] 
    }) => FollowerService.sendFlyerToFollowers(promoterId, flyerUrl, title, description, targetTiers),
    onSuccess: () => {
      toast({
        title: 'Flyer sent!',
        description: 'Your flyer has been sent to your followers.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send flyer',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Send discount code to followers
  const sendDiscountCode = useMutation({
    mutationFn: ({ 
      promoterId, 
      discountCode, 
      title, 
      description, 
      expiresAt, 
      targetTiers 
    }: { 
      promoterId: string; 
      discountCode: string; 
      title: string; 
      description: string; 
      expiresAt?: string; 
      targetTiers?: string[] 
    }) => FollowerService.sendDiscountCodeToFollowers(
      promoterId, 
      discountCode, 
      title, 
      description, 
      expiresAt, 
      targetTiers
    ),
    onSuccess: () => {
      toast({
        title: 'Discount code sent!',
        description: 'Your discount code has been sent to your followers.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send discount code',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Update notification preferences
  const updatePreferences = useMutation({
    mutationFn: ({ 
      subscriptionId, 
      preferences 
    }: { 
      subscriptionId: string; 
      preferences: NotificationPreferences 
    }) => FollowerService.updateNotificationPreferences(subscriptionId, preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update preferences',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return {
    // Data
    userFollows: userFollows.data || [],
    promoterFollowers: promoterFollowers.data || [],
    
    // Loading states
    isLoading: userFollows.isLoading || promoterFollowers.isLoading,
    
    // Mutations
    follow,
    subscribe,
    unfollow,
    sendNotification,
    sendFlyer,
    sendDiscountCode,
    updatePreferences,
    
    // Refetch functions
    refetchUserFollows: userFollows.refetch,
    refetchPromoterFollowers: promoterFollowers.refetch
  };
}
