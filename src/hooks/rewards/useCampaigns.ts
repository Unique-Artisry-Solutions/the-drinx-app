
import { useState, useEffect } from 'react';
import { RewardCampaign } from '@/types/rewards';
import { toast } from 'sonner';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<RewardCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Mock campaigns data with complete performance metrics
        const mockCampaigns: RewardCampaign[] = [
          {
            id: '1',
            name: 'Summer Points Boost',
            description: 'Double points for all activities during summer',
            status: 'active',
            is_active: true,
            start_date: '2024-06-01T00:00:00Z',
            end_date: '2024-08-31T23:59:59Z',
            budget: 5000,
            target_audience: [
              {
                id: 'filter-1',
                type: 'tier',
                value: 'silver',
                description: 'Silver tier members'
              }
            ],
            rewards: [
              {
                id: 'reward-1',
                type: 'points',
                value: '100',
                description: 'Bonus 100 points'
              }
            ],
            trigger_conditions: [
              {
                id: 'trigger-1',
                type: 'visit',
                value: 'any',
                description: 'Any establishment visit'
              }
            ],
            performance_metrics: {
              impressions: 1250,
              clicks: 89,
              conversions: 23,
              spend: 850,
              total_users_reached: 1200,
              total_rewards_claimed: 23,
              engagement_rate: 0.071,
              total_points_awarded: 2300,
              daily_metrics: []
            },
            created_at: '2024-05-15T10:00:00Z',
            updated_at: '2024-05-28T14:30:00Z'
          },
          {
            id: '2',
            name: 'New Member Welcome',
            description: 'Welcome rewards for new members',
            status: 'active',
            is_active: true,
            start_date: '2024-01-01T00:00:00Z',
            budget: 2000,
            target_audience: [
              {
                id: 'filter-2',
                type: 'joinDate',
                value: 'last_30_days',
                description: 'Members who joined in the last 30 days'
              }
            ],
            rewards: [
              {
                id: 'reward-2',
                type: 'points',
                value: '50',
                description: 'Welcome bonus 50 points'
              }
            ],
            trigger_conditions: [
              {
                id: 'trigger-2',
                type: 'checkin',
                value: 'first',
                description: 'First check-in'
              }
            ],
            performance_metrics: {
              impressions: 2100,
              clicks: 156,
              conversions: 87,
              spend: 1200,
              total_users_reached: 2000,
              total_rewards_claimed: 87,
              engagement_rate: 0.074,
              total_points_awarded: 4350,
              daily_metrics: [
                {
                  date: '2024-05-27',
                  users_reached: 45,
                  rewards_claimed: 12,
                  points_awarded: 600
                },
                {
                  date: '2024-05-28',
                  users_reached: 52,
                  rewards_claimed: 15,
                  points_awarded: 750
                }
              ]
            },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-05-28T12:00:00Z'
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

  const createCampaign = async (campaignData: Partial<RewardCampaign>) => {
    try {
      setIsLoading(true);
      
      const newCampaign: RewardCampaign = {
        id: `campaign-${Date.now()}`,
        name: campaignData.name || 'New Campaign',
        description: campaignData.description,
        status: campaignData.status || 'draft',
        is_active: campaignData.is_active ?? false,
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
          daily_metrics: []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign created successfully!');
      
      return newCampaign;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create campaign'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (campaignId: string, updates: Partial<RewardCampaign>) => {
    try {
      setIsLoading(true);
      
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, ...updates, updated_at: new Date().toISOString() }
          : campaign
      ));
      
      toast.success('Campaign updated successfully!');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update campaign'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      toast.success('Campaign deleted successfully!');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete campaign'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
};
