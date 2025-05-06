
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAudienceSegments, 
  fetchSegmentWithCriteria,
  createAudienceSegment, 
  updateAudienceSegment, 
  deleteAudienceSegment,
  fetchSegmentMembers,
  fetchSegmentAnalytics
} from '@/services/audienceService';
import { AudienceSegment, AudienceSegmentCriteria } from '@/types/AudienceTypes';
import { useToast } from '@/hooks/use-toast';

export const useAudienceSegments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query for fetching all segments
  const {
    data: segments = [],
    isLoading: isLoadingSegments,
    isError: isSegmentsError,
    error: segmentsError,
    refetch: refetchSegments
  } = useQuery({
    queryKey: ['audience-segments'],
    queryFn: fetchAudienceSegments
  });
  
  // Query for fetching a single segment with criteria
  const useSegmentDetails = (segmentId: string | undefined) => {
    return useQuery({
      queryKey: ['audience-segment', segmentId],
      queryFn: () => segmentId ? fetchSegmentWithCriteria(segmentId) : Promise.reject('No segment ID provided'),
      enabled: !!segmentId
    });
  };
  
  // Query for fetching segment members
  const useSegmentMembers = (segmentId: string | undefined) => {
    return useQuery({
      queryKey: ['audience-segment-members', segmentId],
      queryFn: () => segmentId ? fetchSegmentMembers(segmentId) : Promise.reject('No segment ID provided'),
      enabled: !!segmentId
    });
  };
  
  // Query for fetching segment analytics
  const useSegmentAnalytics = (segmentId: string | undefined, startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ['audience-segment-analytics', segmentId, startDate, endDate],
      queryFn: () => segmentId ? fetchSegmentAnalytics(segmentId, startDate, endDate) : Promise.reject('No segment ID provided'),
      enabled: !!segmentId
    });
  };
  
  // Mutation for creating a segment
  const createSegment = useMutation({
    mutationFn: (data: {
      segment: Omit<AudienceSegment, 'id' | 'created_at' | 'updated_at'>;
      criteria: Omit<AudienceSegmentCriteria, 'id' | 'segment_id' | 'created_at' | 'updated_at'>[];
    }) => createAudienceSegment(data.segment, data.criteria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audience-segments'] });
      toast({
        title: "Segment Created",
        description: "The audience segment was created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Segment",
        description: error.message || "An error occurred while creating the segment.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for updating a segment
  const updateSegment = useMutation({
    mutationFn: (data: { id: string; updates: Partial<AudienceSegment> }) => 
      updateAudienceSegment(data.id, data.updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['audience-segments'] });
      queryClient.invalidateQueries({ queryKey: ['audience-segment', variables.id] });
      toast({
        title: "Segment Updated",
        description: "The audience segment was updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Segment",
        description: error.message || "An error occurred while updating the segment.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for deleting a segment
  const deleteSegment = useMutation({
    mutationFn: deleteAudienceSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audience-segments'] });
      toast({
        title: "Segment Deleted",
        description: "The audience segment was deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Segment",
        description: error.message || "An error occurred while deleting the segment.",
        variant: "destructive"
      });
    }
  });
  
  return {
    segments,
    isLoadingSegments,
    isSegmentsError,
    segmentsError,
    refetchSegments,
    useSegmentDetails,
    useSegmentMembers,
    useSegmentAnalytics,
    createSegment,
    updateSegment,
    deleteSegment
  };
};
