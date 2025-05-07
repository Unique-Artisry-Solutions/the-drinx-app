
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { 
  fetchEventCampaigns,
  createMarketingCampaign,
  updateMarketingCampaign,
  deleteMarketingCampaign,
  trackCampaignMetric,
  generateCampaignLink
} from '@/services/eventMarketingService';

export const useEventMarketing = (eventId: string) => {
  const [campaigns, setCampaigns] = useState<EventMarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadCampaigns = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchEventCampaigns(eventId);
      setCampaigns(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load marketing campaigns',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [eventId]);

  const createCampaign = async (campaign: Omit<EventMarketingCampaign, 'id'>) => {
    setIsLoading(true);
    try {
      const newCampaign = await createMarketingCampaign(campaign);
      setCampaigns(prev => [...prev, newCampaign]);
      toast({
        title: 'Success',
        description: 'Marketing campaign created successfully',
      });
      return newCampaign;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (id: string, updates: Partial<EventMarketingCampaign>) => {
    setIsLoading(true);
    try {
      const updated = await updateMarketingCampaign(id, updates);
      setCampaigns(prev => 
        prev.map(c => c.id === id ? { ...c, ...updated } : c)
      );
      toast({
        title: 'Success',
        description: 'Campaign updated successfully',
      });
      return updated;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteMarketingCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Success',
        description: 'Campaign deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete campaign',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const trackMetric = async (campaignId: string, metricName: string, value: number = 1) => {
    try {
      await trackCampaignMetric(campaignId, metricName, value);
      
      // Update local state to reflect the new metric value
      setCampaigns(prev => 
        prev.map(c => {
          if (c.id === campaignId) {
            const metrics = { ...(c.metrics || {
              impressions: 0,
              clicks: 0,
              conversions: 0,
              revenue: 0
            }) };
            
            // Safely update the metric
            if (metricName in metrics) {
              metrics[metricName as keyof typeof metrics] = 
                ((metrics[metricName as keyof typeof metrics] || 0) as number) + value;
            }
            
            return { ...c, metrics };
          }
          return c;
        })
      );
    } catch (err: any) {
      console.error('Failed to track metric:', err);
    }
  };

  const getCampaignLink = (campaignId: string, medium: string = 'website') => {
    return generateCampaignLink(eventId, campaignId, medium);
  };

  return {
    campaigns,
    isLoading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    trackMetric,
    getCampaignLink,
    refresh: loadCampaigns
  };
};
