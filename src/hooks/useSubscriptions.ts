import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Subscription, SubscriptionTier } from '@/types/SubscriptionTypes';

export const useSubscriptions = (promoterId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['subscriptions', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          tier:promoter_subscription_tiers(*)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        status: item.follow_status || 'active',
        tier_name: item.tier?.name || (item.tier_id ? 'Unknown Tier' : 'Free Follower')
      })) as Subscription[];
    },
    enabled: !!promoterId,
  });

  const { data: subscribedPromoters = [], isLoading: isLoadingSubscribed } = useQuery({
    queryKey: ['subscribed-promoters'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          promoter_id,
          subscriber_id,
          subscription_start,
          subscription_end,
          follow_status,
          tier_id,
          notification_preferences,
          promoter:promoter_id (
            id,
            display_name,
            username
          ),
          tier:promoter_subscription_tiers(*)
        `)
        .eq('subscriber_id', user.id)
        .eq('follow_status', 'active');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: tiers = [], isLoading: isLoadingTiers } = useQuery({
    queryKey: ['subscription-tiers', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_subscription_tiers')
        .select('*')
        .eq('promoter_id', promoterId)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      return data as SubscriptionTier[];
    },
    enabled: !!promoterId,
  });

  // New mutation for following (free)
  const follow = useMutation({
    mutationFn: async ({ promoterId }: { promoterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('promoter_followers')
        .insert({
          subscriber_id: user.id,
          promoter_id: promoterId,
          tier_id: null, // Free follower
          follow_status: 'active',
          notification_preferences: {
            events: true,
            promotions: true,
            announcements: true
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscribed-promoters'] });
      toast({
        title: 'Following successfully',
        description: 'You are now following this promoter',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Follow failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Updated subscription mutation for premium tiers
  const subscribe = useMutation({
    mutationFn: async ({ promoterId, tierId }: { promoterId: string; tierId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if already following/subscribed
      const { data: existing } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('subscriber_id', user.id)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active')
        .single();

      if (existing) {
        // Update existing follow to premium subscription
        const { data, error } = await supabase
          .from('promoter_followers')
          .update({
            tier_id: tierId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new premium subscription
        const { data, error } = await supabase
          .from('promoter_followers')
          .insert({
            subscriber_id: user.id,
            promoter_id: promoterId,
            tier_id: tierId,
            follow_status: 'active',
            notification_preferences: {
              events: true,
              promotions: true,
              announcements: true
            }
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscribed-promoters'] });
      toast({
        title: 'Subscribed successfully',
        description: 'You are now subscribed to this promoter',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Subscription failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const unsubscribe = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('promoter_followers')
        .update({ follow_status: 'cancelled' })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscribed-promoters'] });
      toast({
        title: 'Unsubscribed successfully',
        description: 'You have unsubscribed from this promoter',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Unsubscribe failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['subscription-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // Use profiles table directly instead of helper function
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Parse location settings from the bio field
      let locationSettings = null;
      if (data && data.bio) {
        try {
          const bioData = JSON.parse(data.bio);
          if (bioData.location_settings) {
            locationSettings = {
              id: data.id,
              user_id: data.id,
              location_sharing: bioData.location_settings.sharing || false,
              notification_radius: bioData.location_settings.radius || 10,
              created_at: data.created_at,
              updated_at: data.updated_at
            };
          }
        } catch (e) {
          console.error('Error parsing bio JSON:', e);
        }
      }
      
      return locationSettings;
    },
  });

  return {
    subscriptions,
    subscribedPromoters,
    tiers,
    settings: null, // Simplified for now
    isLoading: isLoadingSubscriptions || isLoadingTiers || isLoadingSubscribed,
    follow,
    subscribe,
    unsubscribe,
  };
};
