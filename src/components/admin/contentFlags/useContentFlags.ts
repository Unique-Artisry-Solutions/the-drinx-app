
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { FlaggedContentQueueItem } from '@/types/DatabaseTypes';

export const useContentFlags = () => {
  const { toast } = useToast();
  const [selectedFlag, setSelectedFlag] = useState<FlaggedContentQueueItem | null>(null);
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  const { data: flags, isLoading: loadingFlags, refetch } = useQuery({
    queryKey: ['content-flags'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('flagged_content_queue' as any)
        .select('*')
        .order('reported_at', { ascending: false }) as any);
        
      if (error) throw error;
      return data as FlaggedContentQueueItem[];
    }
  });

  // Handle flag dismissal
  const handleDismiss = async (flag: FlaggedContentQueueItem) => {
    setIsLoading(prev => ({ ...prev, [flag.flag_id]: true }));
    
    try {
      // Update the flag status to dismissed
      const { error } = await (supabase
        .from('content_flags' as any)
        .update({ 
          status: 'dismissed',
        })
        .eq('id', flag.flag_id) as any);
      
      if (error) throw error;
      
      // Log moderation action
      await (supabase
        .from('moderation_actions' as any)
        .insert({
          content_type: flag.content_type,
          content_id: flag.content_id,
          moderator_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'dismiss_flag',
          reason: 'No action needed'
        }) as any);
      
      toast({
        title: "Flag dismissed",
        description: "The content flag has been dismissed.",
      });
      
      setSelectedFlag(null);
      refetch();
    } catch (error) {
      console.error('Error dismissing flag:', error);
      toast({
        title: "Dismissal failed",
        description: "There was a problem dismissing this flag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [flag.flag_id]: false }));
    }
  };

  // Handle taking action on flagged content
  const handleTakeAction = async (flag: FlaggedContentQueueItem, action: string, reason: string) => {
    setIsLoading(prev => ({ ...prev, [flag.flag_id]: true }));
    
    try {
      // Update the flag status to reviewed
      const { error: flagError } = await (supabase
        .from('content_flags' as any)
        .update({ 
          status: 'reviewed',
        })
        .eq('id', flag.flag_id) as any);
      
      if (flagError) throw flagError;
      
      // Take action on the content based on the content type
      if (flag.content_type === 'photo') {
        const { error } = await (supabase
          .from('moderation_photos' as any)
          .update({ 
            content_status: action === 'approve' ? 'approved' : 'rejected',
            moderated_at: new Date().toISOString(),
            moderated_by: (await supabase.auth.getUser()).data.user?.id,
            rejection_reason: action === 'reject' ? reason : null
          })
          .eq('id', flag.content_id) as any);
        
        if (error) throw error;
      } else if (flag.content_type === 'review') {
        const { error } = await (supabase
          .from('cocktail_reviews' as any)
          .update({ 
            content_status: action === 'approve' ? 'approved' : 'rejected'
          })
          .eq('id', flag.content_id) as any);
        
        if (error) throw error;
      }
      
      // Log moderation action
      await (supabase
        .from('moderation_actions' as any)
        .insert({
          content_type: flag.content_type,
          content_id: flag.content_id,
          moderator_id: (await supabase.auth.getUser()).data.user?.id,
          action: action,
          reason: reason
        }) as any);
      
      toast({
        title: action === 'approve' ? "Content approved" : "Content rejected",
        description: `The flagged ${flag.content_type} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      });
      
      setSelectedFlag(null);
      refetch();
    } catch (error) {
      console.error('Error taking action on flag:', error);
      toast({
        title: "Action failed",
        description: "There was a problem processing this action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [flag.flag_id]: false }));
    }
  };

  return {
    flags,
    loadingFlags,
    selectedFlag,
    setSelectedFlag,
    isLoading,
    handleDismiss,
    handleTakeAction,
    refetch
  };
};
