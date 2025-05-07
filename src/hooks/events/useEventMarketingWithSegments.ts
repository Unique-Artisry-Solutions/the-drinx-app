import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign, ABTestResult } from '@/types/EventTypes';
import { 
  fetchEventCampaigns,
  createMarketingCampaign,
  updateMarketingCampaign,
  deleteMarketingCampaign,
  trackCampaignMetric,
  getSegmentTargetedContent,
  getCampaignABTestResults,
  createSegmentBasedNotification
} from '@/services/eventMarketingService';

// Import segment-related services
import {
  fetchCampaignSegmentMappings,
  assignSegmentsToCampaign,
  removeCampaignSegment,
  getCampaignSegmentPerformance,
  trackSegmentMetric,
  getAvailableSegmentsForCampaign
} from '@/services/campaignSegmentService';

// Import audience segment hooks
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { SegmentSelection, NotificationPriority } from '@/types/CampaignSegmentTypes';
import { validateNotificationPriority } from '@/services/typeAdapterService';

export const useEventMarketingWithSegments = (eventId: string) => {
  const [campaigns, setCampaigns] = useState<EventMarketingCampaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<EventMarketingCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [segmentsLoading, setSegmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { segments } = useAudienceSegments();

  // Load campaigns data
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

  // Create a new campaign
  const createCampaign = async (campaign: Omit<EventMarketingCampaign, 'id'>) => {
    setIsLoading(true);
    try {
      // Ensure required fields are set
      const completeMetrics = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        ...campaign.metrics
      };
      
      const completeData: Omit<EventMarketingCampaign, 'id'> = {
        ...campaign,
        metrics: completeMetrics,
        event_id: eventId
      };
      
      const newCampaign = await createMarketingCampaign(completeData);
      
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

  // Update an existing campaign
  const updateCampaign = async (id: string, updates: Partial<EventMarketingCampaign>) => {
    setIsLoading(true);
    try {
      const updated = await updateMarketingCampaign(id, updates);
      
      setCampaigns(prev => 
        prev.map(c => c.id === id ? { ...c, ...updated } : c)
      );
      
      if (activeCampaign?.id === id) {
        setActiveCampaign(prev => prev ? { ...prev, ...updated } : prev);
      }
      
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

  // Delete a campaign
  const deleteCampaign = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteMarketingCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
      
      if (activeCampaign?.id === id) {
        setActiveCampaign(null);
      }
      
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

  // Set active campaign for segment operations
  const selectCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setActiveCampaign(campaign);
    }
  };

  // Track campaign metrics - updated signature to match service function
  const trackMetric = async (
    campaignId: string, 
    metricName: string, 
    value: number = 1, 
    source?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      // Call the service function with the appropriate parameters
      await trackCampaignMetric(campaignId, metricName, value, source, metadata);
      
      // Update local state to reflect the new metric value
      setCampaigns(prev => 
        prev.map(c => {
          if (c.id === campaignId) {
            // Make a deep copy of the metrics to avoid reference issues
            const updatedMetrics = { ...c.metrics };
            
            // Safely update the specific metric
            if (typeof updatedMetrics[metricName] === 'number') {
              updatedMetrics[metricName] = (updatedMetrics[metricName] || 0) + value;
            }
            
            // Update source metrics if applicable
            if (source && updatedMetrics.sources) {
              if (!updatedMetrics.sources[source]) {
                updatedMetrics.sources[source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
              }
              
              if (metricName in updatedMetrics.sources[source]) {
                updatedMetrics.sources[source][metricName] += value;
              }
            }
            
            return { ...c, metrics: updatedMetrics };
          }
          return c;
        })
      );
      
      // Also update active campaign if it's the one being modified
      if (activeCampaign?.id === campaignId) {
        setActiveCampaign(prev => {
          if (!prev) return prev;
          
          const updatedMetrics = { ...prev.metrics };
          if (typeof updatedMetrics[metricName] === 'number') {
            updatedMetrics[metricName] = (updatedMetrics[metricName] || 0) + value;
          }
          
          // Update source metrics if applicable
          if (source && updatedMetrics.sources) {
            if (!updatedMetrics.sources[source]) {
              updatedMetrics.sources[source] = { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };
            }
            
            if (metricName in updatedMetrics.sources[source]) {
              updatedMetrics.sources[source][metricName] += value;
            }
          }
          
          return { ...prev, metrics: updatedMetrics };
        });
      }
    } catch (err: any) {
      console.error('Failed to track metric:', err);
    }
  };

  // Segment-related functions
  const assignSegments = async (campaign: EventMarketingCampaign, segmentSelections: SegmentSelection[]) => {
    if (!campaign?.id) return;
    
    setSegmentsLoading(true);
    try {
      await assignSegmentsToCampaign(campaign.id, segmentSelections);
      
      toast({
        title: 'Success',
        description: 'Segments assigned successfully',
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to assign segments',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSegmentsLoading(false);
    }
  };

  const removeSegment = async (mappingId: string) => {
    setSegmentsLoading(true);
    try {
      await removeCampaignSegment(mappingId);
      
      toast({
        title: 'Success',
        description: 'Segment removed successfully',
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove segment',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSegmentsLoading(false);
    }
  };

  const getSegmentMappings = async (campaignId: string) => {
    setSegmentsLoading(true);
    try {
      return await fetchCampaignSegmentMappings(campaignId);
    } catch (err: any) {
      console.error('Failed to fetch segment mappings:', err);
      return [];
    } finally {
      setSegmentsLoading(false);
    }
  };

  const getSegmentPerformance = async (campaignId: string) => {
    setSegmentsLoading(true);
    try {
      return await getCampaignSegmentPerformance(campaignId);
    } catch (err: any) {
      console.error('Failed to fetch segment performance:', err);
      return [];
    } finally {
      setSegmentsLoading(false);
    }
  };

  const trackSegmentConversion = async (
    campaignId: string,
    segmentId: string,
    conversionType: 'impression' | 'click' | 'conversion',
    value: number = 1
  ) => {
    try {
      // Track in both the campaign and the segment
      await trackCampaignMetric(campaignId, conversionType, value);
      await trackSegmentMetric(campaignId, segmentId, conversionType, value);
      
      return true;
    } catch (err: any) {
      console.error(`Failed to track segment ${conversionType}:`, err);
      return false;
    }
  };
  
  // Helper function to get targeted content for a segment
  const getTargetedContent = async (segmentId: string, contentType: string) => {
    try {
      return await getSegmentTargetedContent(segmentId, contentType);
    } catch (err: any) {
      console.error('Failed to get targeted content:', err);
      return [];
    }
  };
  
  // Helper function to create a notification for a segment
  const createSegmentNotification = async (
    segmentId: string, 
    title: string, 
    content: string,
    priority: NotificationPriority = 'medium'
  ): Promise<boolean> => {
    try {
      // Validate priority before sending
      const validPriority = validateNotificationPriority(priority);
      return await createSegmentBasedNotification(segmentId, title, content, eventId, validPriority);
    } catch (err: any) {
      console.error('Failed to create segment notification:', err);
      return false;
    }
  };
  
  // Get A/B test results from campaigns
  const getABTestResults = async (campaignId: string): Promise<ABTestResult> => {
    try {
      return await getCampaignABTestResults(campaignId);
    } catch (err: any) {
      console.error('Failed to get A/B test results:', err);
      return { 
        variants: [], 
        winner: null,
        variantA: undefined,
        variantB: undefined,
        improvement: 0,
        significantResult: false
      };
    }
  };

  return {
    campaigns,
    activeCampaign,
    isLoading,
    segmentsLoading,
    error,
    segments,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    selectCampaign,
    trackMetric,
    assignSegments,
    removeSegment,
    getSegmentMappings,
    getSegmentPerformance,
    trackSegmentConversion,
    getTargetedContent,
    createSegmentNotification,
    getABTestResults,
    refresh: loadCampaigns
  };
};
