
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
  const { threads, setThreads, loading, error, fetchThreads } = useThreads(userType, user?.id);
  const { fetchMessages, sendMessage } = useMessages(userType);
  const { updateThreadReadStatus, markThreadAsRead, subscribeToReadStatusUpdates } = useThreadReadStatus(user?.id);
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
    if (threads.length === 0 || !user?.id) return;

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
  }, [threads.map(t => t.id).join(','), user?.id]); // Depend on thread IDs string

  // Subscribe to new messages for real-time thread updates
  useEffect(() => {
    if (!user?.id) return;

    const filterColumn = userType === 'promoter' ? 'promoter_id' : 'venue_id';
    const channel = supabase
      .channel(`messages-${userType}-${user.id}`)
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
          const { data: threadData } = await supabase
            .from('promoter_venue_threads')
            .select('id, venue_id, promoter_id')
            .eq('id', payload.new.thread_id)
            .eq(filterColumn, user.id)
            .single();

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
  }, [user?.id, userType, fetchThreads]);

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
