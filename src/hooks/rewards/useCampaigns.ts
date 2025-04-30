
import { useState, useEffect } from 'react';
import { RewardCampaign } from '@/lib/rewards/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isPreviewEnvironment } from '@/utils/environment';

// Sample data for preview mode
const sampleCampaigns: RewardCampaign[] = [
  {
    id: '1',
    name: 'Summer Bonus Points',
    description: 'Earn double points on all purchases during summer',
    start_date: '2025-06-01T00:00:00Z',
    end_date: '2025-08-31T23:59:59Z',
    is_active: true,
    audience_filters: [
      {
        id: 'af1',
        type: 'tier',
        value: 'gold',
        description: 'Users in tier: gold'
      }
    ],
    rewards: [
      {
        id: 'r1',
        type: 'points',
        value: '2x',
        description: 'Double points on all purchases'
      }
    ],
    trigger_conditions: [
      {
        id: 't1',
        type: 'schedule',
        value: 'automatic',
        description: 'Automatically triggered by schedule'
      }
    ],
    establishment_id: 'default',
    created_at: '2025-04-15T10:30:00Z',
    updated_at: '2025-04-15T10:30:00Z',
    status: 'scheduled',
    performance_metrics: {
      total_users_reached: 0,
      total_rewards_claimed: 0,
      engagement_rate: 0,
      total_points_awarded: 0,
      daily_metrics: []
    }
  },
  {
    id: '2',
    name: 'Welcome Reward',
    description: 'Special reward for new users',
    start_date: '2025-04-01T00:00:00Z',
    end_date: '2025-12-31T23:59:59Z',
    is_active: true,
    audience_filters: [
      {
        id: 'af2',
        type: 'joinDate',
        value: 'last_30_days',
        description: 'Users who joined: last 30 days'
      }
    ],
    rewards: [
      {
        id: 'r2',
        type: 'offering',
        value: 'free_item',
        description: 'Free welcome item'
      }
    ],
    trigger_conditions: [
      {
        id: 't2',
        type: 'event',
        value: 'user_registration',
        description: 'Event trigger: user_registration'
      }
    ],
    establishment_id: 'default',
    created_at: '2025-03-20T15:45:00Z',
    updated_at: '2025-03-20T15:45:00Z',
    status: 'active',
    performance_metrics: {
      total_users_reached: 238,
      total_rewards_claimed: 187,
      engagement_rate: 0.79,
      total_points_awarded: 1870,
      daily_metrics: [
        { date: '2025-04-20', users_reached: 12, rewards_claimed: 9, points_awarded: 90 },
        { date: '2025-04-21', users_reached: 14, rewards_claimed: 11, points_awarded: 110 },
        { date: '2025-04-22', users_reached: 10, rewards_claimed: 8, points_awarded: 80 },
        { date: '2025-04-23', users_reached: 16, rewards_claimed: 13, points_awarded: 130 },
        { date: '2025-04-24', users_reached: 9, rewards_claimed: 7, points_awarded: 70 },
        { date: '2025-04-25', users_reached: 18, rewards_claimed: 14, points_awarded: 140 },
        { date: '2025-04-26', users_reached: 11, rewards_claimed: 8, points_awarded: 80 },
      ]
    }
  }
];

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    
    try {
      // In preview mode, use sample data
      if (isPreviewEnvironment()) {
        setCampaigns(sampleCampaigns);
        setIsLoading(false);
        return;
      }

      // In real environment, fetch from Supabase
      const { data, error } = await supabase
        .from('reward_campaigns')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Transform data using the helper function
      const transformedCampaigns = data.map(campaign => {
        return {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          is_active: campaign.is_active,
          audience_filters: campaign.audience_filters || [],
          rewards: campaign.rewards || [],
          trigger_conditions: campaign.trigger_conditions || [],
          establishment_id: campaign.establishment_id,
          created_at: campaign.created_at,
          updated_at: campaign.updated_at,
          status: campaign.status || 'draft',
          performance_metrics: campaign.performance_metrics
        };
      });
      
      setCampaigns(transformedCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to sample data in case of error
      if (isPreviewEnvironment()) {
        setCampaigns(sampleCampaigns);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const createCampaign = async (campaignData: Partial<RewardCampaign>) => {
    try {
      if (isPreviewEnvironment()) {
        // In preview mode, simulate creation
        const newCampaign: RewardCampaign = {
          id: `campaign-${Date.now()}`,
          name: campaignData.name || 'New Campaign',
          description: campaignData.description,
          start_date: campaignData.start_date || new Date().toISOString(),
          end_date: campaignData.end_date || new Date().toISOString(),
          is_active: campaignData.is_active || false,
          audience_filters: campaignData.audience_filters || [],
          rewards: campaignData.rewards || [],
          trigger_conditions: campaignData.trigger_conditions || [],
          establishment_id: campaignData.establishment_id || 'default',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: campaignData.status as any || 'draft',
          performance_metrics: {
            total_users_reached: 0,
            total_rewards_claimed: 0,
            engagement_rate: 0,
            total_points_awarded: 0,
            daily_metrics: []
          }
        };
        
        setCampaigns(prev => [...prev, newCampaign]);
        return newCampaign;
      }

      // In real environment, insert into Supabase
      const { data, error } = await supabase
        .from('reward_campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      await fetchCampaigns();
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateCampaign = async (campaignId: string, campaignData: Partial<RewardCampaign>) => {
    try {
      if (isPreviewEnvironment()) {
        // In preview mode, simulate update
        setCampaigns(prev => 
          prev.map(camp => 
            camp.id === campaignId 
              ? { ...camp, ...campaignData, updated_at: new Date().toISOString() } 
              : camp
          )
        );
        return;
      }

      // In real environment, update in Supabase
      const { error } = await supabase
        .from('reward_campaigns')
        .update({
          ...campaignData,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);
      
      if (error) {
        throw error;
      }
      
      await fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const deleteCampaign = async (campaignId: string) => {
    try {
      if (isPreviewEnvironment()) {
        // In preview mode, simulate deletion
        setCampaigns(prev => prev.filter(camp => camp.id !== campaignId));
        return;
      }

      // In real environment, delete from Supabase
      const { error } = await supabase
        .from('reward_campaigns')
        .delete()
        .eq('id', campaignId);
      
      if (error) {
        throw error;
      }
      
      await fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const activateCampaign = async (campaignId: string) => {
    return updateCampaign(campaignId, { 
      is_active: true,
      status: 'active' as any
    });
  };
  
  const deactivateCampaign = async (campaignId: string) => {
    return updateCampaign(campaignId, { 
      is_active: false,
      status: 'paused' as any
    });
  };
  
  const getCampaignById = (campaignId: string) => {
    return campaigns.find(campaign => campaign.id === campaignId);
  };
  
  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    activateCampaign,
    deactivateCampaign,
    getCampaignById
  };
}
