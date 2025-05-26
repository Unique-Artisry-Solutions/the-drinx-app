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
import { 
  assignSegmentsToCampaign,
  getCampaignSegmentMappings,
  updateCampaignSegmentMapping,
  removeSegmentFromCampaign,
  getCampaignSegmentAnalytics,
  recordSegmentInteraction,
  getAvailableSegmentsForCampaign
} from '@/services/campaignSegmentService';
import { CampaignSegmentMapping, CampaignSegmentAnalytics, InteractionType } from '@/types/CampaignSegmentTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { useMutation } from '@tanstack/react-query';

export const useEventMarketingWithSegments = (eventId: string) => {
  const [campaigns, setCampaigns] = useState<EventMarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segmentMappings, setSegmentMappings] = useState<Record<string, CampaignSegmentMapping[]>>({});
  const [segmentAnalytics, setSegmentAnalytics] = useState<Record<string, CampaignSegmentAnalytics[]>>({});
  const { toast } = useToast();

  // Load campaigns
  const loadCampaigns = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchEventCampaigns(eventId);
      setCampaigns(data);
      
      // Load segment mappings for each campaign
      const mappingsObj: Record<string, CampaignSegmentMapping[]> = {};
      const analyticsObj: Record<string, CampaignSegmentAnalytics[]> = {};
      
      await Promise.all(data.map(async (campaign) => {
        try {
          const mappings = await getCampaignSegmentMappings(campaign.id);
          mappingsObj[campaign.id] = mappings;
          
          const analytics = await getCampaignSegmentAnalytics(campaign.id);
          analyticsObj[campaign.id] = analytics;
        } catch (err) {
          console.error(`Error loading segment data for campaign ${campaign.id}:`, err);
        }
      }));
      
      setSegmentMappings(mappingsObj);
      setSegmentAnalytics(analyticsObj);
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

  // Create campaign (original function)
  const createCampaign = async (campaign: Omit<EventMarketingCampaign, 'event_id'>) => {
    setIsLoading(true);
    try {
      const newCampaign = await createMarketingCampaign({
        ...campaign,
        event_id: eventId
      });
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

  // Create campaign with segments
  const createCampaignWithSegments = async (
    campaign: Omit<EventMarketingCampaign, 'event_id'>,
    segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean }[]
  ) => {
    try {
      // First create the campaign
      const newCampaign = await createCampaign(campaign);
      
      // Then assign segments if there are any
      if (segments.length > 0) {
        const mappings = await assignSegmentsToCampaign(newCampaign.id, segments);
        setSegmentMappings(prev => ({
          ...prev,
          [newCampaign.id]: mappings
        }));
      }
      
      return newCampaign;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign with segments',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Update campaign (original function)
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

  // Delete campaign (original function)
  const deleteCampaign = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteMarketingCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      
      // Also remove any segment mappings and analytics for this campaign
      const updatedMappings = { ...segmentMappings };
      delete updatedMappings[id];
      setSegmentMappings(updatedMappings);
      
      const updatedAnalytics = { ...segmentAnalytics };
      delete updatedAnalytics[id];
      setSegmentAnalytics(updatedAnalytics);
      
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

  // Track generic campaign metric (original function)
  const trackMetric = async (campaignId: string, metricName: string, value: number = 1) => {
    try {
      await trackCampaignMetric(campaignId, metricName, value);
      
      // Update local state to reflect the new metric value
      setCampaigns(prev => 
        prev.map(c => {
          if (c.id === campaignId) {
            const metrics = { ...(c.metrics || {}) };
            metrics[metricName] = (metrics[metricName] || 0) + value;
            return { ...c, metrics };
          }
          return c;
        })
      );
    } catch (err: any) {
      console.error('Failed to track metric:', err);
    }
  };

  // Assign segments to a campaign
  const assignSegments = async (
    campaignId: string,
    segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean; description?: string }[]
  ) => {
    try {
      const mappings = await assignSegmentsToCampaign(campaignId, segments);
    
      // Update local state
      setSegmentMappings(prev => ({
        ...prev,
        [campaignId]: [...(prev[campaignId] || []), ...mappings]
      }));
    
      toast({
        title: 'Success',
        description: 'Segments assigned to campaign successfully',
      });
    
      return mappings;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to assign segments to campaign',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Update a segment mapping
  const updateSegmentMapping = async (
    mappingId: string,
    campaignId: string,
    updates: Partial<CampaignSegmentMapping>
  ) => {
    try {
      const updated = await updateCampaignSegmentMapping(mappingId, updates);
      
      // Update local state
      setSegmentMappings(prev => ({
        ...prev,
        [campaignId]: prev[campaignId]?.map(m => 
          m.id === mappingId ? { ...m, ...updated } : m
        ) || []
      }));
      
      toast({
        title: 'Success',
        description: 'Campaign segment mapping updated successfully',
      });
      
      return updated;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update segment mapping',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Remove a segment from a campaign
  const removeSegment = async (
    mappingId: string,
    campaignId: string
  ) => {
    try {
      await removeSegmentFromCampaign(mappingId);
      
      // Update local state
      setSegmentMappings(prev => ({
        ...prev,
        [campaignId]: prev[campaignId]?.filter(m => m.id !== mappingId) || []
      }));
      
      toast({
        title: 'Success',
        description: 'Segment removed from campaign successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove segment from campaign',
        variant: 'destructive'
      });
      throw err;
    }
  };

  // Record a segment-specific interaction
  const trackSegmentInteraction = async (
    campaignId: string,
    segmentId: string,
    interactionType: InteractionType,
    value: number = 1
  ) => {
    try {
      await recordSegmentInteraction(campaignId, segmentId, interactionType, value);
      
      // We could refresh the analytics here but that might be expensive
      // Instead, optimistically update the local state
      setSegmentAnalytics(prev => {
        const campaignAnalytics = prev[campaignId] || [];
        return {
          ...prev,
          [campaignId]: campaignAnalytics.map(analytic => {
            if (analytic.segment_id === segmentId) {
              const updatedAnalytic = { ...analytic };
              
              switch (interactionType) {
                case 'impression':
                  updatedAnalytic.total_impressions += value;
                  break;
                case 'click':
                  updatedAnalytic.total_clicks += value;
                  // Recalculate click-through rate
                  if (updatedAnalytic.total_impressions > 0) {
                    updatedAnalytic.click_through_rate = 
                      (updatedAnalytic.total_clicks / updatedAnalytic.total_impressions) * 100;
                  }
                  break;
                case 'conversion':
                  updatedAnalytic.total_conversions += value;
                  // Recalculate conversion rate
                  if (updatedAnalytic.total_clicks > 0) {
                    updatedAnalytic.conversion_rate = 
                      (updatedAnalytic.total_conversions / updatedAnalytic.total_clicks) * 100;
                  }
                  break;
              }
              
              return updatedAnalytic;
            }
            return analytic;
          })
        };
      });
    } catch (err: any) {
      console.error(`Failed to track ${interactionType} for segment:`, err);
    }
  };

  // Gets all segments available to be added to a campaign
  const getAvailableSegments = async (campaignId: string): Promise<AudienceSegment[]> => {
    try {
      return await getAvailableSegmentsForCampaign(campaignId);
    } catch (err: any) {
      console.error('Failed to get available segments:', err);
      throw err;
    }
  };

  // Create segment-based notification
  const createSegmentNotificationMutation = useMutation({
    mutationFn: (data: {
      campaignId: string;
      segmentId: string;
      title: string;
      content: string;
      priority?: 'low' | 'medium' | 'high';
    }) => eventMarketingService.createSegmentBasedNotification(
      data.campaignId,
      data.segmentId,
      {
        title: data.title,
        content: data.content,
        priority: data.priority
      }
    ),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Segment-based notification created successfully',
      });
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: 'Failed to create segment-based notification',
        variant: 'destructive'
      });
    }
  });

  // Get campaign link (original function)
  const getCampaignLink = (campaignId: string, medium: string = 'website', segmentId?: string) => {
    if (segmentId) {
      // If segmentId is provided, add it to the UTM parameters
      return generateCampaignLink(eventId, campaignId, medium, segmentId);
    }
    return generateCampaignLink(eventId, campaignId, medium);
  };

  // Refresh the campaign segment analytics
  const refreshCampaignAnalytics = async (campaignId: string) => {
    try {
      const analytics = await getCampaignSegmentAnalytics(campaignId);
      setSegmentAnalytics(prev => ({
        ...prev,
        [campaignId]: analytics
      }));
    } catch (err: any) {
      console.error('Failed to refresh campaign analytics:', err);
    }
  };

  return {
    // Original properties
    campaigns,
    isLoading,
    error,
    
    // Original methods
    createCampaign,
    updateCampaign,
    deleteCampaign,
    trackMetric,
    getCampaignLink,
    refresh: loadCampaigns,
    
    // New segment-related properties
    segmentMappings,
    segmentAnalytics,
    
    // New segment-related methods
    createCampaignWithSegments,
    assignSegments,
    updateSegmentMapping,
    removeSegment,
    trackSegmentInteraction,
    getAvailableSegments,
    refreshCampaignAnalytics,
    createSegmentNotificationMutation
  };
};
