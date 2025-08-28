
import { useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useThreadSubscription = (threadId: string | null, onNewMessage: () => void) => {
  const channelRef = useRef<any>(null);

  const setupRealtimeSubscription = useCallback(() => {
    if (threadId) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      const channel = supabase
        .channel(`messages-${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (_payload) => {
            console.log('Received new message');
            onNewMessage();
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for thread ${threadId}: ${status}`);
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to thread ${threadId}`);
          }
        });

      channelRef.current = channel;
    }
  }, [threadId, onNewMessage]);

  useEffect(() => {
    setupRealtimeSubscription();
    return () => {
      if (channelRef.current) {
        console.log(`Cleaning up subscription for thread ${threadId}`);
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [threadId, setupRealtimeSubscription]);

  return { setupRealtimeSubscription };
};

