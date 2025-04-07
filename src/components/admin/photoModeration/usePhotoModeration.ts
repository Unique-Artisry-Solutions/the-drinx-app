
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ModerationPhoto } from '@/utils/photoModerationUtils';

export const usePhotoModeration = (initialTab: string = 'pending') => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedPhoto, setSelectedPhoto] = useState<ModerationPhoto | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  // Fetch photos based on status
  const { data: photos, isLoading: loadingPhotos, refetch } = useQuery({
    queryKey: ['moderation-photos', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as unknown as ModerationPhoto[];
    }
  });

  // Handle photo approval
  const handleApprove = async (photo: ModerationPhoto) => {
    setIsLoading(prev => ({ ...prev, [photo.id]: true }));
    
    try {
      const { error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .update({ 
          status: 'approved',
          moderated_at: new Date().toISOString(),
          moderated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      toast({
        title: "Photo approved",
        description: "The photo has been approved and will now be visible to users.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error approving photo:', error);
      toast({
        title: "Approval failed",
        description: "There was a problem approving this photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  // Handle photo rejection
  const handleReject = async (photo: ModerationPhoto) => {
    setIsLoading(prev => ({ ...prev, [photo.id]: true }));
    
    try {
      const { error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .update({ 
          status: 'rejected',
          moderated_at: new Date().toISOString(),
          moderated_by: (await supabase.auth.getUser()).data.user?.id,
          rejection_reason: rejectionReason || 'Content policy violation'
        })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      toast({
        title: "Photo rejected",
        description: "The photo has been rejected and will not be visible to users.",
      });
      
      setRejectionReason('');
      setSelectedPhoto(null);
      refetch();
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast({
        title: "Rejection failed",
        description: "There was a problem rejecting this photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  return {
    activeTab,
    setActiveTab,
    photos,
    loadingPhotos,
    isLoading,
    selectedPhoto,
    setSelectedPhoto,
    rejectionReason,
    setRejectionReason,
    handleApprove,
    handleReject,
    refetch
  };
};
