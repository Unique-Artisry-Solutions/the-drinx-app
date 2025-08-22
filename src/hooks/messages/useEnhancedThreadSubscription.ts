import { useCallback, useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from './types';

interface MessageStatus {
  id: string;
  status: 'sending' | 'sent' | 'failed';
  timestamp: string;
}

export const useEnhancedThreadSubscription = (
  threadId: string | null, 
  onNewMessage: () => void,
  userId?: string
) => {
  const channelRef = useRef<any>(null);
  const [messageStatuses, setMessageStatuses] = useState<Map<string, MessageStatus>>(new Map());

  // Track message status
  const updateMessageStatus = useCallback((messageId: string, status: MessageStatus['status']) => {
    setMessageStatuses(prev => {
      const newMap = new Map(prev);
      newMap.set(messageId, {
        id: messageId,
        status,
        timestamp: new Date().toISOString()
      });
      return newMap;
    });
  }, []);

  const setupRealtimeSubscription = useCallback(() => {
    if (threadId) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      const channel = supabase
        .channel(`enhanced-messages-${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('📨 Received new message:', payload);
            
            // Update message status if it's from current user
            if (payload.new.sender_id === userId) {
              updateMessageStatus(payload.new.id, 'sent');
            }
            
            onNewMessage();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('📝 Message updated:', payload);
            onNewMessage();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'message_read_status',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('👁️ Read status updated:', payload);
            onNewMessage();
          }
        )
        .subscribe((status) => {
          console.log(`🔄 Enhanced subscription status for thread ${threadId}:`, status);
          if (status === 'SUBSCRIBED') {
            console.log(`✅ Successfully subscribed to enhanced thread ${threadId}`);
          }
        });

      channelRef.current = channel;
    }
  }, [threadId, onNewMessage, userId, updateMessageStatus]);

  useEffect(() => {
    setupRealtimeSubscription();
    return () => {
      if (channelRef.current) {
        console.log(`🧹 Cleaning up enhanced subscription for thread ${threadId}`);
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [threadId, setupRealtimeSubscription]);

  // Clean up old message statuses
  useEffect(() => {
    const cleanup = setInterval(() => {
      setMessageStatuses(prev => {
        const newMap = new Map();
        const cutoff = Date.now() - 30000; // Keep statuses for 30 seconds
        
        for (const [id, status] of prev.entries()) {
          if (new Date(status.timestamp).getTime() > cutoff) {
            newMap.set(id, status);
          }
        }
        
        return newMap;
      });
    }, 10000); // Clean up every 10 seconds

    return () => clearInterval(cleanup);
  }, []);

  return { 
    setupRealtimeSubscription, 
    messageStatuses,
    updateMessageStatus 
  };
};