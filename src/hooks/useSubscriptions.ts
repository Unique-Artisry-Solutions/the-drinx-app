
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AppSubscription, SubscriptionTier } from '@/types/SubscriptionTypes';

export const useSubscriptions = (promoterId?: string) => {
  const supabaseClient = useSupabaseClient();
  const { toast } = useToast();
  const user = useUser();

  // Fetch subscription tiers
  const { 
    data: tiers = [], 
    isLoading: isLoadingTiers 
  } = useQuery({
    queryKey: ['subscription-tiers', promoterId],
    queryFn: async () => {
      if (!promoterId) return [];
      
      const { data, error } = await supabaseClient
        .from('promoter_subscription_tiers')
        .select('*')
        .eq('promoter_id', promoterId)
        .eq('is_active', true);
      
      if (error) throw error;
      
      return data as SubscriptionTier[];
    },
    enabled: !!promoterId,
  });

  // Fetch user subscriptions
  const { 
    data: subscriptions = [], 
    isLoading: isLoadingSubscriptions,
    refetch 
  } = useQuery({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabaseClient
        .from('app_subscriptions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data as AppSubscription[];
    },
    enabled: !!user,
  });

  // Subscribe to a tier
  const subscribe = useMutation({
    mutationFn: async ({ promoterId, tierId }: { promoterId: string, tierId: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabaseClient
        .from('app_subscriptions')
        .insert({
          user_id: user.id,
          subscription_type: 'basic', // Default
          status: 'active',
          subscription_start: new Date().toISOString(),
        })
        .select();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Subscription successful',
        description: 'You have successfully subscribed'
      });
    },
    onError: () => {
      toast({
        title: 'Subscription failed',
        description: 'Could not process your subscription',
        variant: 'destructive'
      });
    }
  });

  // Unsubscribe from a tier
  const unsubscribe = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data, error } = await supabaseClient
        .from('app_subscriptions')
        .update({ 
          status: 'cancelled',
          subscription_end: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .select();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Unsubscribed',
        description: 'You have successfully unsubscribed'
      });
    },
    onError: () => {
      toast({
        title: 'Unsubscribe failed',
        description: 'Could not process your unsubscription request',
        variant: 'destructive'
      });
    }
  });

  const isLoading = isLoadingTiers || isLoadingSubscriptions;

  return {
    tiers,
    subscriptions,
    isLoading,
    refetch,
    subscribe,
    unsubscribe,
    error: null // Added for compatibility
  };
};
