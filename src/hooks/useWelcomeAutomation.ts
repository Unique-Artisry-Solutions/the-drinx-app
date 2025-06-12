
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { WelcomeAutomationFlow, ScheduledWelcomeMessage } from '@/types/welcomeAutomation';

export const useWelcomeAutomation = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get automation flows
  const { data: flows = [], isLoading: flowsLoading } = useQuery({
    queryKey: ['welcome-automation-flows', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .select('*')
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching automation flows:', error);
        return [];
      }

      return data as WelcomeAutomationFlow[];
    },
    enabled: !!promoterId
  });

  // Get scheduled messages for a flow
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['welcome-automation-messages', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_welcome_messages')
        .select('*')
        .eq('promoter_id', promoterId)
        .order('step_number');

      if (error) {
        console.error('Error fetching scheduled messages:', error);
        return [];
      }

      return data as ScheduledWelcomeMessage[];
    },
    enabled: !!promoterId
  });

  // Create automation flow
  const createFlow = useMutation({
    mutationFn: async (flowData: Partial<WelcomeAutomationFlow>) => {
      // Ensure required fields are present
      const flowToInsert = {
        promoter_id: promoterId,
        flow_name: flowData.flow_name || 'New Flow',
        description: flowData.description || '',
        is_active: flowData.is_active ?? true,
        flow_config: flowData.flow_config || {
          duration_days: 7,
          total_steps: 3,
          auto_advance: true,
          personalization_enabled: false,
          engagement_tracking: true
        },
        trigger_conditions: flowData.trigger_conditions || {
          trigger_on: 'new_follower',
          delay_minutes: 0,
          conditions: []
        },
        completion_criteria: flowData.completion_criteria || {
          all_steps_completed: true,
          min_engagement_score: 0,
          time_limit_days: 30
        },
        success_metrics: flowData.success_metrics || {}
      };

      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .insert(flowToInsert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-automation-flows'] });
      toast({
        title: "Flow Created",
        description: "Welcome automation flow has been created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating flow:', error);
      toast({
        title: "Error",
        description: "Failed to create automation flow. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Create scheduled messages
  const createMessages = useMutation({
    mutationFn: async ({ flowId, messages: messageList }: { 
      flowId: string; 
      messages: Partial<ScheduledWelcomeMessage>[] 
    }) => {
      // Transform messages to include required fields
      const messagesToInsert = messageList.map(msg => ({
        promoter_id: promoterId,
        automation_flow_id: flowId,
        step_number: msg.step_number || 1,
        step_name: msg.step_name || 'Untitled Step',
        delay_minutes: msg.delay_minutes || 0,
        message_type: msg.message_type || 'welcome',
        subject_line: msg.subject_line || '',
        message_content: msg.message_content || '',
        message_data: msg.message_data || {},
        send_conditions: msg.send_conditions || {},
        is_active: msg.is_active ?? true
      }));

      const { data, error } = await supabase
        .from('scheduled_welcome_messages')
        .insert(messagesToInsert)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-automation-messages'] });
      toast({
        title: "Messages Created",
        description: "Welcome messages have been scheduled successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating messages:', error);
      toast({
        title: "Error",
        description: "Failed to create scheduled messages. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update flow
  const updateFlow = useMutation({
    mutationFn: async ({ flowId, updates }: { 
      flowId: string; 
      updates: Partial<WelcomeAutomationFlow> 
    }) => {
      const { data, error } = await supabase
        .from('welcome_automation_flows')
        .update(updates)
        .eq('id', flowId)
        .eq('promoter_id', promoterId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-automation-flows'] });
      toast({
        title: "Flow Updated",
        description: "Automation flow has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating flow:', error);
      toast({
        title: "Error",
        description: "Failed to update automation flow. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete flow
  const deleteFlow = useMutation({
    mutationFn: async (flowId: string) => {
      const { error } = await supabase
        .from('welcome_automation_flows')
        .delete()
        .eq('id', flowId)
        .eq('promoter_id', promoterId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['welcome-automation-flows'] });
      queryClient.invalidateQueries({ queryKey: ['welcome-automation-messages'] });
      toast({
        title: "Flow Deleted",
        description: "Automation flow has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting flow:', error);
      toast({
        title: "Error",
        description: "Failed to delete automation flow. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    flows,
    messages,
    isLoading: flowsLoading || messagesLoading,
    createFlow,
    createMessages,
    updateFlow,
    deleteFlow
  };
};
