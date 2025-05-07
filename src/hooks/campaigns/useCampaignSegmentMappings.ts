
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CampaignSegmentMapping } from '@/types/CampaignSegmentTypes';
import { fetchCampaignSegmentMappings } from '@/services/campaignSegmentService';

export const useCampaignSegmentMappings = (campaignId: string | undefined) => {
  const [mappings, setMappings] = useState<CampaignSegmentMapping[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadMappings = async () => {
    if (!campaignId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchCampaignSegmentMappings(campaignId);
      setMappings(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load segment mappings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      loadMappings();
    }
  }, [campaignId]);

  return {
    mappings,
    isLoading,
    error,
    refresh: loadMappings
  };
};

export default useCampaignSegmentMappings;
