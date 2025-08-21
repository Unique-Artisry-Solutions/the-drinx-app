
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { MessageThread, UserType } from './types';
import { useThreads } from './useThreads';
import { useMessages } from './useMessages';
import { useThreadReadStatus } from './useThreadReadStatus';
import { useThreadCreation } from './useThreadCreation';
import { useThreadSelection } from './useThreadSelection';

export const useMessageSystem = (userType: UserType) => {
  const { user } = useAuthenticatedUser();
  
  // Use the current user's ID directly
  const effectiveUserId = user?.id;
  
  const { threads, setThreads, loading, error, fetchThreads } = useThreads(userType, effectiveUserId);
  const { fetchMessages, sendMessage } = useMessages(userType);
  const { updateThreadReadStatus, markThreadAsRead, subscribeToReadStatusUpdates } = useThreadReadStatus(effectiveUserId);
  const { createThread, isCreating } = useThreadCreation();
  
  const { selectedThreadId, setSelectedThreadId } = useThreadSelection(
    setThreads,
    markThreadAsRead,
    fetchMessages
  );

  // Update read status for all threads whenever threads change
  useEffect(() => {
    if (threads.length > 0) {
      updateThreadReadStatus(threads).then(updatedThreads => {
        setThreads(updatedThreads);
      });
    }
  }, [threads.length]); // Only run when thread count changes to avoid infinite loops

  // Subscribe to read status updates for real-time updates
  useEffect(() => {
    if (threads.length === 0 || !effectiveUserId) return;

    const threadIds = threads.map(t => t.id);
    const channel = subscribeToReadStatusUpdates(threadIds, () => {
      // Refresh read status when updates occur
      updateThreadReadStatus(threads).then(updatedThreads => {
        setThreads(updatedThreads);
      });
    });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [threads.map(t => t.id).join(','), effectiveUserId]); // Depend on thread IDs string

  // Subscribe to new messages for real-time thread updates
  useEffect(() => {
    if (!effectiveUserId) return;

    const channel = supabase
      .channel(`messages-${userType}-${effectiveUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promoter_venue_messages'
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Check if this message belongs to one of our threads
          let threadData = null;
          
          if (userType === 'promoter') {
            // For promoters, check if thread's promoter_id matches user
            const { data } = await supabase
              .from('promoter_venue_threads')
              .select('id, venue_id, promoter_id')
              .eq('id', payload.new.thread_id)
              .eq('promoter_id', effectiveUserId)
              .single();
            threadData = data;
          } else {
            // For establishments, check if thread's venue is owned by user
            const { data } = await supabase
              .from('promoter_venue_threads')
              .select(`
                id, 
                venue_id, 
                promoter_id,
                establishments!venue_id(owner_id)
              `)
              .eq('id', payload.new.thread_id)
              .eq('establishments.owner_id', effectiveUserId)
              .single();
            threadData = data;
          }

          if (threadData) {
            // Refresh threads to get updated last message and timestamp
            fetchThreads();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [effectiveUserId, userType, fetchThreads]);

  const refetchThreads = useCallback(async () => {
    await fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    selectedThreadId,
    setSelectedThreadId,
    markThreadAsRead,
    sendMessage,
    createThread,
    isCreating,
    refetchThreads
  };
};

export type { Message, MessageThread } from './types';
