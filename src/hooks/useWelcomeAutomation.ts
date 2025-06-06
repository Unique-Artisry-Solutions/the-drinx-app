
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { WelcomeAutomationFlow, ScheduledWelcomeMessage, FollowerOnboardingProgress, ScheduledMessageDelivery } from '@/types/welcomeAutomation';

export function useWelcomeAutomation(promoterId?: string) {
  const queryClient = useQueryClient();

  // Get welcome automation flows
  const { data: flows = [], isLoading: flowsLoading } = useQuery({
    queryKey: ['welcome-flows', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .select('*')
        .or(`promoter_id.eq.${promoterId},promoter_id.is.null`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WelcomeAutomationFlow[];
    },
    enabled: !!promoterId
  });

  // Get scheduled messages for a flow
  const getWelcomeMessages = (flowId: string) => useQuery({
    queryKey: ['welcome-messages', flowId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_welcome_messages')
        .select('*')
        .eq('automation_flow_id', flowId)
        .eq('is_active', true)
        .order('step_number', { ascending: true });

      if (error) throw error;
      return data as ScheduledWelcomeMessage[];
    },
    enabled: !!flowId
  });

  // Get onboarding progress for followers
  const { data: onboardingProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['onboarding-progress', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follower_onboarding_progress')
        .select(`
          *,
          promoter_followers!inner(
            id,
            promoter_id,
            subscriber_id,
            promoter_name,
            follow_status
          )
        `)
        .eq('promoter_followers.promoter_id', promoterId)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data as (FollowerOnboardingProgress & { promoter_followers: any })[];
    },
    enabled: !!promoterId
  });

  // Get message deliveries
  const getMessageDeliveries = (followerId?: string) => useQuery({
    queryKey: ['message-deliveries', followerId],
    queryFn: async () => {
      if (!followerId) return [];
      
      const { data, error } = await supabase
        .from('scheduled_message_deliveries')
        .select(`
          *,
          scheduled_welcome_messages(
            step_number,
            step_name,
            message_type,
            subject_line,
            message_content
          )
        `)
        .eq('follower_id', followerId)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      return data as (ScheduledMessageDelivery & { scheduled_welcome_messages: any })[];
    },
    enabled: !!followerId
  });

  // Create welcome flow
  const createWelcomeFlow = useMutation({
    mutationFn: async (flowData: Partial<WelcomeAutomationFlow>) => {
      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .insert([{
          ...flowData,
          promoter_id: promoterId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-flows', promoterId] });
    }
  });

  // Update welcome flow
  const updateWelcomeFlow = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WelcomeAutomationFlow> & { id: string }) => {
      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-flows', promoterId] });
    }
  });

  // Create welcome message
  const createWelcomeMessage = useMutation({
    mutationFn: async (messageData: Partial<ScheduledWelcomeMessage>) => {
      const { data, error } = await supabase
        .from('scheduled_welcome_messages')
        .insert([{
          ...messageData,
          promoter_id: promoterId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['welcome-messages', data.automation_flow_id] });
    }
  });

  // Update welcome message
  const updateWelcomeMessage = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ScheduledWelcomeMessage> & { id: string }) => {
      const { data, error } = await supabase
        .from('scheduled_welcome_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['welcome-messages', data.automation_flow_id] });
    }
  });

  // Advance onboarding step
  const advanceOnboardingStep = useMutation({
    mutationFn: async (followerId: string) => {
      const { data, error } = await supabase.rpc('advance_onboarding_step', {
        p_follower_id: followerId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', promoterId] });
    }
  });

  // Start onboarding manually
  const startOnboarding = useMutation({
    mutationFn: async (followerId: string) => {
      const { data, error } = await supabase.rpc('start_follower_onboarding', {
        p_follower_id: followerId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress', promoterId] });
    }
  });

  return {
    // Data
    flows,
    onboardingProgress,
    
    // Loading states
    flowsLoading,
    progressLoading,
    
    // Mutations
    createWelcomeFlow,
    updateWelcomeFlow,
    createWelcomeMessage,
    updateWelcomeMessage,
    advanceOnboardingStep,
    startOnboarding,
    
    // Queries
    getWelcomeMessages,
    getMessageDeliveries
  };
}
