
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePaymentProvider } from '@/hooks/usePaymentProvider';
import { AppSubscription } from '@/types/SubscriptionTypes';

export const useAppSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { stripe, isReady: isStripeReady } = usePaymentProvider();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['app-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('app_subscriptions')
        .select()
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as AppSubscription | null;
    },
  });

  const createCheckoutSession = useMutation({
    mutationFn: async ({ priceId, subscriptionType }: { priceId: string, subscriptionType: string }) => {
      if (!stripe || !isStripeReady) {
        throw new Error('Payment provider not ready');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create a checkout session through your backend
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          subscriptionType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Checkout Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      if (!subscription) throw new Error('No active subscription');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // If it's a paid subscription with a payment provider, cancel through the provider
      if (subscription.payment_provider && subscription.payment_id) {
        // Request to backend to cancel subscription with the provider
        const response = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: subscription.payment_id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to cancel subscription');
        }
      }

      // Update the subscription status in the database
      const { error } = await supabase
        .from('app_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscription.id);

      if (error) throw error;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-subscription'] });
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been successfully cancelled.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    subscription,
    isLoading,
    createCheckoutSession,
    cancelSubscription,
  };
};
