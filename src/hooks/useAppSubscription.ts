
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appSubscriptionService } from '@/services/AppSubscriptionService';
import { useToast } from '@/hooks/use-toast';

export function useAppSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get available plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['app-subscription-plans'],
    queryFn: () => appSubscriptionService.getAvailablePlans()
  });

  // Get user's current subscription
  const { data: userSubscription, isLoading: subscriptionLoading, refetch } = useQuery({
    queryKey: ['user-app-subscription'],
    queryFn: () => appSubscriptionService.getUserSubscription()
  });

  // Check if user has active subscription
  const hasActiveSubscription = userSubscription?.status === 'active';

  // Create subscription
  const createSubscription = useMutation({
    mutationFn: (planId: string) => appSubscriptionService.createSubscription(planId),
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.open(data.url, '_blank');
    },
    onError: (error: Error) => {
      toast({
        title: 'Subscription Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: () => appSubscriptionService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-app-subscription'] });
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will be cancelled at the end of the current billing period.'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Check subscription status
  const checkStatus = useMutation({
    mutationFn: () => appSubscriptionService.checkSubscriptionStatus(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-app-subscription'] });
    }
  });

  return {
    // Data
    plans,
    userSubscription,
    hasActiveSubscription,
    
    // Loading states
    isLoading: plansLoading || subscriptionLoading,
    
    // Actions
    createSubscription,
    cancelSubscription,
    checkStatus,
    refetch
  };
}
