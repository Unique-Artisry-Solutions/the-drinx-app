
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { MessageThread, UserType } from './types';
import { useThreads } from './useThreads';
import { useMessages } from './useMessages';
import { useThreadReadStatus } from './useThreadReadStatus';
import { useThreadCreation } from './useThreadCreation';
import { useThreadSelection } from './useThreadSelection';
import { realtimeConnectionManager } from '@/utils/realtime/connectionManager';

export const useMessageSystem = (userType: UserType) => {
  const { user } = useAuthenticatedUser();
  
  // Use the current user's ID directly
  const effectiveUserId = user?.id;
  
  // Refs for cleanup
  const readStatusChannelRef = useRef<any>(null);
  const messagesChannelRef = useRef<any>(null);
  
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

  // Subscribe to read status updates for real-time updates with optimized connection management
  useEffect(() => {
    if (threads.length === 0 || !effectiveUserId) return;

    const threadIds = threads.map(t => t.id);
    const channelName = `read-status-${effectiveUserId}`;
    
    const setupReadStatusSubscription = async () => {
      try {
        // Clean up existing channel
        if (readStatusChannelRef.current) {
          realtimeConnectionManager.removeChannel(channelName);
          readStatusChannelRef.current = null;
        }

        // Create new subscription with connection manager
        const channel = await realtimeConnectionManager.subscribeToChannel({
          name: channelName,
          handler: () => {
            // Refresh read status when updates occur
            updateThreadReadStatus(threads).then(updatedThreads => {
              setThreads(updatedThreads);
            });
          },
          options: {
            event: '*',
            schema: 'public',
            table: 'message_read_status',
            filter: `user_id=eq.${effectiveUserId}`
          }
        });

        readStatusChannelRef.current = channel;
        console.log(`📡 Read status subscription established for ${threadIds.length} threads`);
      } catch (error) {
        console.error('Failed to establish read status subscription:', error);
      }
    };

    setupReadStatusSubscription();

    return () => {
      if (readStatusChannelRef.current) {
        realtimeConnectionManager.removeChannel(channelName);
        readStatusChannelRef.current = null;
      }
    };
  }, [threads.map(t => t.id).join(','), effectiveUserId]); // Depend on thread IDs string

  // Subscribe to new messages for real-time thread updates with optimized connection management
  useEffect(() => {
    if (!effectiveUserId) return;

    const channelName = `messages-${userType}-${effectiveUserId}`;
    
    const setupMessageSubscription = async () => {
      try {
        // Clean up existing channel
        if (messagesChannelRef.current) {
          realtimeConnectionManager.removeChannel(channelName);
          messagesChannelRef.current = null;
        }

        // Create new subscription with connection manager
        const channel = await realtimeConnectionManager.subscribeToChannel({
          name: channelName,
          handler: async (payload) => {
            console.log('💬 New message received:', payload);
            
            // Debounce rapid messages
            setTimeout(async () => {
              // Check if this message belongs to one of our threads
              let threadData = null;
              
              try {
                if (userType === 'promoter') {
                  // For promoters, check if thread's promoter_id matches user
                  const { data } = await supabase
                    .from('promoter_venue_threads')
                    .select('id, venue_id, promoter_id')
                    .eq('id', payload.new.thread_id)
                    .eq('promoter_id', effectiveUserId)
                    .maybeSingle();
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
                    .maybeSingle();
                  threadData = data;
                }

                if (threadData) {
                  console.log('📨 Message belongs to our thread, refreshing...');
                  // Refresh threads to get updated last message and timestamp
                  fetchThreads();
                }
              } catch (error) {
                console.error('Error processing new message:', error);
              }
            }, 100); // 100ms debounce
          },
          options: {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages'
          }
        });

        messagesChannelRef.current = channel;
        console.log(`📡 Message subscription established for ${userType} user ${effectiveUserId}`);
      } catch (error) {
        console.error('Failed to establish message subscription:', error);
      }
    };

    setupMessageSubscription();

    return () => {
      if (messagesChannelRef.current) {
        realtimeConnectionManager.removeChannel(channelName);
        messagesChannelRef.current = null;
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
    refetchThreads
  };
};

export type { Message, MessageThread } from './types';
