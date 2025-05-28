
import { useState, useEffect } from 'react';
import { RewardCampaign } from '@/types/rewards';
import { toast } from 'sonner';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock campaigns data
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockCampaigns: RewardCampaign[] = [
          {
            id: 'campaign-1',
            name: 'Welcome Bonus',
            description: 'New user welcome campaign',
            status: 'active',
            is_active: true,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            budget: 1000,
            target_audience: [],
            rewards: [],
            trigger_conditions: [],
            performance_metrics: {
              impressions: 0,
              clicks: 0,
              conversions: 0,
              spend: 0,
              total_users_reached: 0,
              total_rewards_claimed: 0,
              engagement_rate: 0,
              total_points_awarded: 0,
              roi_estimate: 0,
              daily_metrics: []
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setCampaigns(mockCampaigns);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const createCampaign = async (campaignData: Partial<RewardCampaign>): Promise<RewardCampaign> => {
    try {
      const newCampaign: RewardCampaign = {
        id: `campaign-${Date.now()}`,
        name: campaignData.name || 'New Campaign',
        description: campaignData.description,
        status: campaignData.status || 'draft',
        is_active: campaignData.is_active || false,
        start_date: campaignData.start_date,
        end_date: campaignData.end_date,
        budget: campaignData.budget,
        target_audience: campaignData.target_audience || [],
        rewards: campaignData.rewards || [],
        trigger_conditions: campaignData.trigger_conditions || [],
        performance_metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          total_users_reached: 0,
          total_rewards_claimed: 0,
          engagement_rate: 0,
          total_points_awarded: 0,
          roi_estimate: 0,
          daily_metrics: []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign created successfully');
      return newCampaign;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create campaign');
      setError(error);
      toast.error('Failed to create campaign');
      throw error;
    }
  };

  const updateCampaign = async (campaignId: string, updates: Partial<RewardCampaign>): Promise<RewardCampaign> => {
    try {
      const updatedCampaign = campaigns.find(c => c.id === campaignId);
      if (!updatedCampaign) {
        throw new Error('Campaign not found');
      }

      const updated = { ...updatedCampaign, ...updates, updated_at: new Date().toISOString() };
      setCampaigns(prev => prev.map(c => c.id === campaignId ? updated : c));
      toast.success('Campaign updated successfully');
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update campaign');
      setError(error);
      toast.error('Failed to update campaign');
      throw error;
    }
  };

  const deleteCampaign = async (campaignId: string): Promise<void> => {
    try {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      toast.success('Campaign deleted successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete campaign');
      setError(error);
      toast.error('Failed to delete campaign');
      throw error;
    }
  };

  const activateCampaign = async (campaignId: string): Promise<void> => {
    try {
      await updateCampaign(campaignId, { status: 'active', is_active: true });
      toast.success('Campaign activated successfully');
    } catch (err) {
      toast.error('Failed to activate campaign');
      throw err;
    }
  };

  const deactivateCampaign = async (campaignId: string): Promise<void> => {
    try {
      await updateCampaign(campaignId, { status: 'paused', is_active: false });
      toast.success('Campaign deactivated successfully');
    } catch (err) {
      toast.error('Failed to deactivate campaign');
      throw err;
    }
  };

  const fetchCampaigns = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Mock refetch - in real implementation this would call an API
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Campaigns refreshed');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch campaigns');
      setError(error);
      toast.error('Failed to refresh campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    isLoading,
    error: error || new Error('Mock error for compatibility'),
    createCampaign,
    updateCampaign,
    deleteCampaign,
    activateCampaign,
    deactivateCampaign,
    fetchCampaigns
  };
};
