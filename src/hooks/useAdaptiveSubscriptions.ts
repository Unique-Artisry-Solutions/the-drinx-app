
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { subscriptionAdapter } from '@/services/SubscriptionAdapter';
import { useFeatureFlags } from './useFeatureFlags';

export function useAdaptiveSubscriptions(promoterId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { flags } = useFeatureFlags();

  // Adaptive follower fetching
  const { data: followers = [], isLoading: followersLoading } = useQuery({
    queryKey: ['adaptive-followers', promoterId, flags.useNewFollowerSystem],
    queryFn: async () => {
      if (!promoterId) return [];
      return await subscriptionAdapter.getFollowers(promoterId);
    },
    enabled: !!promoterId
  });

  // Adaptive notification sending
  const sendNotification = useMutation({
    mutationFn: async (data: { message: string; title?: string; priority?: string }) => {
      if (!promoterId) throw new Error('Promoter ID required');
      
      return await subscriptionAdapter.sendNotification(promoterId, data.message, {
        title: data.title,
        priority: data.priority || 'medium'
      });
    },
    onSuccess: (result) => {
      toast({
        title: 'Notification Sent',
        description: `Successfully sent to ${result.sentCount} followers`,
      });
      
      if (result.errors?.length) {
        console.warn('Some notifications failed:', result.errors);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send notification',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Health check for dual-system operation
  const { data: systemHealth } = useQuery({
    queryKey: ['follower-system-health', promoterId],
    queryFn: async () => {
      if (!promoterId) return null;
      
      try {
        // Test both systems
        const newSystemData = await subscriptionAdapter.getFollowers(promoterId, true);
        const legacySystemData = await subscriptionAdapter.getFollowers(promoterId, false);
        
        return {
          newSystemWorking: true,
          legacySystemWorking: true,
          newSystemCount: newSystemData.length,
          legacySystemCount: legacySystemData.length,
          systemInSync: newSystemData.length === legacySystemData.length
        };
      } catch (error) {
        return {
          newSystemWorking: false,
          legacySystemWorking: true,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },
    enabled: !!promoterId && flags.useNewFollowerSystem,
    refetchInterval: 60000 // Check every minute during transition
  });

  return {
    followers,
    isLoading: followersLoading,
    sendNotification,
    systemHealth,
    
    // Feature flag status
    usingNewSystem: flags.useNewFollowerSystem,
    hasRealTimeNotifications: flags.enableRealTimeNotifications,
    hasAdvancedSegmentation: flags.enableAdvancedSegmentation,
    
    // Actions
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['adaptive-followers', promoterId] });
      queryClient.invalidateQueries({ queryKey: ['follower-system-health', promoterId] });
    }
  };
}
