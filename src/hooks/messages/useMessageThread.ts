
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';
import { supabase } from '@/lib/supabase';
import { useThreadMessages } from './useThreadMessages';
import { useThreadInfo } from './useThreadInfo';
import { useThreadSubscription } from './useThreadSubscription';

export const useMessageThread = (threadId: string | null) => {
  const { toast } = useToast();
  const { executeWithRetry } = useRetry();
  
  const {
    messages,
    loading,
    error,
    fetchMessages,
    setError
  } = useThreadMessages(threadId);

  const {
    threadInfo,
    fetchThreadInfo
  } = useThreadInfo(threadId);

  useThreadSubscription(threadId, fetchMessages);

  const handleArchiveThread = useCallback(async () => {
    if (!threadId) return;
    
    try {
      const { error } = await supabase
        .from('promoter_venue_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (error) throw error;
      
      toast({
        title: "Conversation Archived",
        description: "The conversation has been archived successfully.",
      });
    } catch (err: any) {
      console.error('Error archiving thread:', err);
      setError('Failed to archive conversation: ' + (err.message || ''));
      toast({
        title: "Error",
        description: "Failed to archive conversation. Please try again.",
        variant: "destructive"
      });
    }
  }, [threadId, toast, setError]);

  const retryFetch = useCallback(async () => {
    setError(null);
    try {
      await executeWithRetry(async () => {
        await Promise.all([
          fetchThreadInfo(),
          fetchMessages()
        ]);
      });
    } catch (err: any) {
      setError('Failed to reload messages. Please try again.');
      toast({
        title: "Error",
        description: "Failed to reload messages. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchMessages, fetchThreadInfo, executeWithRetry, toast, setError]);

  return {
    messages,
    loading,
    error,
    threadInfo,
    handleArchiveThread,
    fetchMessages,
    retryFetch
  };
};

