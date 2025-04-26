
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { MessageThread, UserType } from './types';

export const useThreads = (userType: UserType, userId: string | undefined) => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: threadsData, error: threadsError } = await executeWithRetry(async () =>
        supabase
          .from('promoter_venue_threads')
          .select(`
            id,
            promoter_id,
            venue_id,
            subject,
            is_archived,
            last_message_at,
            created_at,
            updated_at,
            venues:establishments(id, name)
          `)
          .eq(userType === 'promoter' ? 'promoter_id' : 'venue_id', userId)
          .order('last_message_at', { ascending: false })
      );

      if (threadsError) throw threadsError;

      const processedThreads: MessageThread[] = threadsData?.map(thread => ({
        id: thread.id,
        venue_id: thread.venue_id,
        promoter_id: thread.promoter_id,
        subject: thread.subject,
        timestamp: thread.last_message_at,
        isRead: false, // Will be updated by useThreadReadStatus
        isArchived: thread.is_archived,
        venueName: thread.venues?.name || undefined,
      })) || [];

      setThreads(processedThreads);
    } catch (err: any) {
      console.error('Error fetching threads:', err);
      setError(err.message || 'Failed to load conversations');
      toast({
        title: "Error Loading Conversations",
        description: "Failed to load your conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, userType, executeWithRetry, toast]);

  return {
    threads,
    setThreads,
    loading,
    error,
    fetchThreads
  };
};
