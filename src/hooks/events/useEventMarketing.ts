import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EventMarketingCampaign } from '@/types/EventTypes';

interface CampaignCreateData {
  event_id: string;
  name: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  description?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: any;
}

export const useEventMarketing = (eventId: string) => {
  const [campaigns, setCampaigns] = useState<EventMarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('event_marketing_campaigns')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;

      setCampaigns(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async (data: CampaignCreateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: campaign, error } = await supabase
        .from('event_marketing_campaigns')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      setCampaigns(prev => [...prev, campaign]);
      return campaign;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (id: string, updates: Partial<EventMarketingCampaign>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: updatedCampaign, error } = await supabase
        .from('event_marketing_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(prev => prev.map(campaign => (campaign.id === id ? updatedCampaign : campaign)));
      return updatedCampaign;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('event_marketing_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchCampaigns();
    }
  }, [eventId]);

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    fetchCampaigns
  };
};
