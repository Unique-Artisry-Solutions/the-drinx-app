
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
      let threadsData, threadsError;
      
      if (userType === 'promoter') {
        // For promoters, filter by promoter_id directly
        const result = await executeWithRetry(async () =>
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
              establishments!venue_id(id, name),
              profiles!promoter_id(id, display_name, username)
            `)
            .eq('promoter_id', userId)
            .order('last_message_at', { ascending: false })
        );
        threadsData = result.data;
        threadsError = result.error;
      } else {
        // For establishments, join with establishments table and filter by owner_id
        const result = await executeWithRetry(async () =>
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
              establishments!venue_id(id, name),
              profiles!promoter_id(id, display_name, username)
            `)
            .eq('establishments.owner_id', userId)
            .order('last_message_at', { ascending: false })
        );
        threadsData = result.data;
        threadsError = result.error;
      }

      if (threadsError) throw threadsError;

      // Fetch last message for each thread
      const threadsWithLastMessage = await Promise.all(
        (threadsData || []).map(async (thread) => {
          try {
            const { data: lastMessageData } = await supabase
              .from('promoter_venue_messages')
              .select('content, sent_at')
              .eq('thread_id', thread.id)
              .order('sent_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              id: thread.id,
              venue_id: thread.venue_id,
              promoter_id: thread.promoter_id,
              subject: thread.subject,
              timestamp: thread.last_message_at || thread.created_at,
              isRead: false, // Will be updated by read status logic
              isArchived: thread.is_archived,
              venueName: thread.establishments?.name || 'Unknown Venue',
              lastMessage: lastMessageData?.content || 'No messages yet',
            };
          } catch (err) {
            console.error('Error fetching last message for thread:', thread.id, err);
            return {
              id: thread.id,
              venue_id: thread.venue_id,
              promoter_id: thread.promoter_id,
              subject: thread.subject,
              timestamp: thread.last_message_at || thread.created_at,
              isRead: false,
              isArchived: thread.is_archived,
              venueName: thread.establishments?.name || 'Unknown Venue',
              lastMessage: 'No messages yet',
            };
          }
        })
      );

      setThreads(threadsWithLastMessage);
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
