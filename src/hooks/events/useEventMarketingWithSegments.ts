import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import * as eventMarketingService from '@/services/eventMarketingService';
import * as campaignService from '@/services/campaignService';
import * as analyticsService from '@/services/analyticsService';

// Define audience segment interface
interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  is_active: boolean;
}

export const useEventMarketingWithSegments = (eventId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for form inputs
  const [campaignName, setCampaignName] = useState('');
  const [segmentName, setSegmentName] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');

  // Fetch campaigns with real-time updates
  const { 
    data: campaigns = [], 
    isLoading: campaignsLoading,
    error: campaignsError 
  } = useQuery({
    queryKey: ['eventCampaigns', eventId],
    queryFn: () => eventMarketingService.fetchEventCampaigns(eventId),
    enabled: !!eventId,
    refetchInterval: 30000 // Refresh every 30 seconds for real-time feel
  });

  // Fetch segments (keeping mock data for now)
  const { 
    data: segments = [], 
    isLoading: segmentsLoading 
  } = useQuery({
    queryKey: ['audienceSegments'],
    queryFn: async (): Promise<AudienceSegment[]> => {
      // For now, return mock data until we implement the segments service
      return [
        {
          id: '1',
          name: 'Early Adopters',
          description: 'Users who sign up early for events',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: '2', 
          name: 'VIP Members',
          description: 'Premium subscribers',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
    }
  });

  // Fetch real-time analytics
  const { data: realtimeAnalytics } = useQuery({
    queryKey: ['realtimeAnalytics'],
    queryFn: () => analyticsService.getRealtimeAnalytics(),
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Create campaign mutation with proper data connection
  const createCampaignMutation = useMutation({
    mutationFn: (name: string) => eventMarketingService.createMarketingCampaign({
      event_id: eventId,
      name,
      campaign_type: 'email',
      description: `Campaign for ${name}`,
      status: 'draft'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventCampaigns', eventId] });
      queryClient.invalidateQueries({ queryKey: ['realtimeAnalytics'] });
      setCampaignName('');
      toast({
        title: "Campaign created",
        description: "Marketing campaign has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating campaign",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  // Create segment mutation (mock for now)
  const createSegmentMutation = useMutation({
    mutationFn: async (name: string) => {
      // Mock implementation - in real app this would call a segments service
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Date.now().toString(),
        name,
        description: `Segment for ${name}`,
        created_at: new Date().toISOString(),
        is_active: true
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audienceSegments'] });
      setSegmentName('');
      toast({
        title: "Segment created",
        description: "Audience segment has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating segment",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  // Enhanced segment notification mutation with metrics tracking
  const createSegmentNotificationMutation = useMutation({
    mutationFn: async ({
      campaignId,
      segmentId,
      title,
      content,
      priority = 'medium'
    }: {
      campaignId: string;
      segmentId: string;
      title: string;
      content: string;
      priority?: 'low' | 'medium' | 'high';
    }) => {
      const result = await eventMarketingService.createSegmentBasedNotification(
        campaignId,
        segmentId,
        { title, content, priority }
      );
      
      // Update metrics in real-time
      await eventMarketingService.updateCampaignMetrics(campaignId, {
        emails_sent: 1,
        impressions: 10 // Estimated impressions per email
      });
      
      return result;
    },
    onSuccess: () => {
      setNotificationTitle('');
      setNotificationContent('');
      queryClient.invalidateQueries({ queryKey: ['eventCampaigns', eventId] });
      queryClient.invalidateQueries({ queryKey: ['realtimeAnalytics'] });
      toast({
        title: "Notification sent",
        description: "Segment notification has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending notification",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  // Helper functions
  const createCampaign = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Invalid input",
        description: "Campaign name is required.",
        variant: "destructive"
      });
      return;
    }
    createCampaignMutation.mutate(name);
  };

  const createSegment = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Invalid input", 
        description: "Segment name is required.",
        variant: "destructive"
      });
      return;
    }
    createSegmentMutation.mutate(name);
  };

  const createSegmentNotification = (
    campaignId: string,
    segmentId: string,
    title: string,
    content: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Invalid input",
        description: "Title and content are required.",
        variant: "destructive"
      });
      return;
    }
    createSegmentNotificationMutation.mutate({
      campaignId,
      segmentId,
      title,
      content,
      priority
    });
  };

  return {
    // Data
    campaigns,
    segments,
    
    // Loading states
    isLoading: campaignsLoading || segmentsLoading,
    
    // Error state
    error: campaignsError ? (campaignsError as Error).message : null,
    
    // Real-time analytics data
    realtimeAnalytics,
    
    // Form state
    campaignName,
    setCampaignName,
    segmentName,
    setSegmentName,
    notificationTitle,
    setNotificationTitle,
    notificationContent,
    setNotificationContent,
    
    // Actions
    createCampaign,
    createSegment,
    createSegmentNotification,
    
    // Enhanced analytics functions
    getCampaignMetrics: (campaignId: string) => 
      campaignService.getCampaignMetrics(campaignId),
    
    updateCampaignMetrics: (campaignId: string, metrics: Partial<campaignService.CampaignMetrics>) =>
      campaignService.updateCampaignMetrics(campaignId, metrics),
    
    // Mutations for advanced usage
    createCampaignMutation,
    createSegmentMutation,
    createSegmentNotificationMutation
  };
};
