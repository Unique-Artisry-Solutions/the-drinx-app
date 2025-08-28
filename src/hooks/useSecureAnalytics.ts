import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SecureAnalyticsService, type RewardAnalyticsData } from '@/services/secureAnalyticsService';
import { useToast } from '@/components/ui/use-toast';

/**
 * React hook for secure analytics operations
 * Handles access control and error messaging
 */
export function useSecureAnalytics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin access
  const { data: hasAdminAccess = false, isLoading: checkingAccess } = useQuery({
    queryKey: ['adminAccess', 'analytics'],
    queryFn: SecureAnalyticsService.checkAdminAccess,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get reward analytics data
  const {
    data: rewardAnalytics = [],
    isLoading: loadingAnalytics,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['secureAnalytics', 'rewards'],
    queryFn: SecureAnalyticsService.getRewardAnalytics,
    enabled: hasAdminAccess, // Only fetch if user has access
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Handle analytics errors
  if (analyticsError && hasAdminAccess) {
    const error = analyticsError as Error;
    if (error.message.includes('Admin privileges required')) {
      toast({
        title: 'Access Denied',
        description: 'You need admin privileges to view analytics data.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Analytics Error',
        description: 'Failed to load analytics data. Please try again.',
        variant: 'destructive',
      });
    }
  }

  // Refresh materialized views mutation
  const refreshViewsMutation = useMutation({
    mutationFn: SecureAnalyticsService.refreshMaterializedViews,
    onSuccess: () => {
      toast({
        title: 'Views Refreshed',
        description: 'Analytics data has been updated successfully.',
      });
      // Invalidate analytics queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['secureAnalytics'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('Admin privileges required')) {
        toast({
          title: 'Access Denied',
          description: 'You need admin privileges to refresh analytics views.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Refresh Failed',
          description: 'Failed to refresh analytics views. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  return {
    // Access control
    hasAdminAccess,
    checkingAccess,

    // Analytics data
    rewardAnalytics,
    loadingAnalytics,
    analyticsError,
    refetchAnalytics,

    // Refresh operations
    refreshViews: refreshViewsMutation.mutate,
    refreshingViews: refreshViewsMutation.isPending,

    // Computed properties
    canAccessAnalytics: hasAdminAccess && !checkingAccess,
    isError: !!analyticsError || refreshViewsMutation.isError,
  };
}