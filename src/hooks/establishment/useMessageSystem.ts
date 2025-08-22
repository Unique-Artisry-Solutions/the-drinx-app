
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useToast } from '@/hooks/use-toast';
import { MessageThread, UserType } from '../messages/types';
import { useThreads } from '../messages/useThreads';
import { useMessages } from '../messages/useMessages';
import { useThreadReadStatus } from '../messages/useThreadReadStatus';
import { useThreadCreation } from '../messages/useThreadCreation';
import { useThreadSelection } from '../messages/useThreadSelection';

export const useEstablishmentMessageSystem = (userType: UserType = 'establishment') => {
  const { user } = useAuthenticatedUser();
  const { toast } = useToast();
  
  // Use the current user's ID directly
  const effectiveUserId = user?.id;
  
  const { threads, setThreads, loading, error, fetchThreads } = useThreads(userType, effectiveUserId);
  const { fetchMessages, sendMessage: baseSendMessage } = useMessages(userType);
  const { updateThreadReadStatus, markThreadAsRead, subscribeToReadStatusUpdates } = useThreadReadStatus(effectiveUserId);
  const { createThread, isCreating } = useThreadCreation();
  
  const { selectedThreadId, setSelectedThreadId } = useThreadSelection(
    setThreads,
    markThreadAsRead,
    fetchMessages
  );

  // Enhanced message sending with optimistic updates and status tracking
  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!effectiveUserId || !content.trim()) return;

    // Create optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      thread_id: threadId,
      content: content.trim(),
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      sender_id: effectiveUserId,
      is_from_promoter: userType === 'promoter',
      is_read: false,
      sender: {
        id: effectiveUserId,
        display_name: user?.user_metadata?.name || 'You',
        username: user?.user_metadata?.username || 'user'
      },
      status: 'sending' as const
    };

    try {
      // Update thread list with optimistic message
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                lastMessage: content.trim(),
                timestamp: new Date().toISOString()
              }
            : thread
        )
      );

      // Send actual message
      await baseSendMessage(threadId, content, effectiveUserId);
      
      // Success - message will be updated via real-time subscription
      toast({
        title: "Message Sent",
        description: "Your message has been delivered successfully.",
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Revert optimistic update on error
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId
            ? {
                ...thread,
                lastMessage: thread.lastMessage, // Keep original
                timestamp: thread.timestamp // Keep original
              }
            : thread
        )
      );

      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [effectiveUserId, user, baseSendMessage, setThreads, toast, userType]);

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

  // Initial fetch when user is available
  useEffect(() => {
    if (effectiveUserId) {
      console.log('🔧 useEstablishmentMessageSystem - Initial fetch for user:', effectiveUserId);
      fetchThreads();
    }
  }, [effectiveUserId, fetchThreads]);

  // Subscribe to new messages for real-time thread updates (optional)
  useEffect(() => {
    if (!effectiveUserId) return;

    let channel: any;
    
    try {
      const filterColumn = userType === 'promoter' ? 'promoter_id' : 'venue_id';
      channel = supabase
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
            const { data: threadData } = await supabase
              .from('promoter_venue_threads')
              .select('id, venue_id, promoter_id')
              .eq('id', payload.new.thread_id)
              .eq(filterColumn, effectiveUserId)
              .single();

            if (threadData) {
              // Refresh threads to get updated last message and timestamp
              fetchThreads();
            }
          }
        )
        .subscribe();
    } catch (error) {
      console.warn('🚨 Real-time subscription failed, messages will still load on refresh:', error);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error cleaning up channel:', error);
        }
      }
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
    refetchThreads,
    effectiveUserId
  };
};

export type { Message, MessageThread } from '../messages/types';
