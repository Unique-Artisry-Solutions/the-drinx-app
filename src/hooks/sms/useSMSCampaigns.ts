import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface SMSCampaign {
  id: string;
  name: string;
  message_body: string;
  target_audience: any;
  scheduled_for?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_by: string;
  total_recipients: number;
  messages_sent: number;
  messages_delivered: number;
  messages_failed: number;
  campaign_cost: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSMSCampaignParams {
  name: string;
  message: string;
  targetAudience: string;
  scheduledFor?: string;
  sendNow?: boolean;
}

export const useSMSCampaigns = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's SMS campaigns
  const getCampaigns = useQuery({
    queryKey: ['sms-campaigns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('sms_campaigns')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Create SMS campaign
  const createCampaign = useMutation({
    mutationFn: async (params: CreateSMSCampaignParams) => {
      if (!user?.id) throw new Error('User not authenticated');

      const campaignData = {
        name: params.name,
        message_body: params.message,
        target_audience: { type: params.targetAudience },
        status: params.sendNow ? 'sent' : 'scheduled',
        created_by: user.id,
        scheduled_for: params.scheduledFor || null
      };

      const { data: campaign, error } = await supabase
        .from('sms_campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;

      // If sending now, trigger bulk SMS
      if (params.sendNow) {
        // Get recipients based on target audience
        const recipients = await getRecipientsForAudience(params.targetAudience);
        
        if (recipients.length > 0) {
          const { data: bulkResult, error: bulkError } = await supabase.functions.invoke('sms-notifications', {
            body: {
              action: 'sendBulkSMS',
              params: {
                recipients: recipients.map(r => ({
                  phoneNumber: r.phone_number,
                  userId: r.user_id
                })),
                message: params.message,
                campaignId: campaign.id
              }
            }
          });

          if (bulkError) {
            console.error('Bulk SMS error:', bulkError);
          }
        }
      }

      return campaign;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sms-campaigns'] });
      toast({
        title: 'SMS Campaign Created',
        description: variables.sendNow ? 
          'SMS messages are being sent to recipients' : 
          'SMS campaign scheduled successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Campaign Creation Failed',
        description: error.message || 'Failed to create SMS campaign',
        variant: 'destructive'
      });
    }
  });

  // Update campaign
  const updateCampaign = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<SMSCampaign> }) => {
      const { data, error } = await supabase
        .from('sms_campaigns')
        .update(params.updates)
        .eq('id', params.id)
        .eq('created_by', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-campaigns'] });
      toast({
        title: 'Campaign Updated',
        description: 'SMS campaign updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update campaign',
        variant: 'destructive'
      });
    }
  });

  // Delete campaign
  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('sms_campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('created_by', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-campaigns'] });
      toast({
        title: 'Campaign Deleted',
        description: 'SMS campaign deleted successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete campaign',
        variant: 'destructive'
      });
    }
  });

  // Get campaign statistics
  const getCampaignStats = useQuery({
    queryKey: ['sms-campaign-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('sms_campaign_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  return {
    campaigns: getCampaigns.data || [],
    isLoading: getCampaigns.isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    campaignStats: getCampaignStats.data || [],
    refetch: getCampaigns.refetch
  };
};

// Helper function to get recipients based on target audience
async function getRecipientsForAudience(targetAudience: string): Promise<Array<{
  phone_number: string;
  user_id: string;
}>> {
  try {
    let query = supabase
      .from('user_phone_numbers')
      .select('phone_number, user_id')
      .eq('sms_opt_in', true)
      .eq('is_verified', true);

    switch (targetAudience) {
      case 'all_subscribers':
        // All opted-in users
        break;
      case 'ticket_holders':
        // Users who have purchased tickets - would need to join with ticket purchases
        // For now, return all subscribers
        break;
      case 'interested_users':
        // Users who have shown interest - could be based on engagement metrics
        // For now, return all subscribers
        break;
      case 'vip_members':
        // VIP tier users - would need to join with user tiers/profiles
        // For now, return all subscribers
        break;
      case 'recent_attendees':
        // Users who attended recent events - would need to join with event attendance
        // For now, return all subscribers
        break;
      default:
        break;
    }

    const { data, error } = await query.limit(1000); // Limit to prevent accidental mass SMS
    
    if (error) {
      console.error('Error fetching SMS recipients:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecipientsForAudience:', error);
    return [];
  }
}