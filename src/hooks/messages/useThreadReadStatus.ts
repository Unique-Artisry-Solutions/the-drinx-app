
import { useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../use-toast';
import { MessageThread } from './types';

export const useThreadReadStatus = (userId: string | undefined) => {
  const { toast } = useToast();

  const updateThreadReadStatus = useCallback(async (threads: MessageThread[]) => {
    if (!userId || threads.length === 0) return threads;

    try {
      const { data: readStatusData } = await supabase
        .from('message_read_status')
        .select('thread_id, last_read_at')
        .in('thread_id', threads.map(t => t.id))
        .eq('user_id', userId);

      // Get the latest message timestamp for each thread to compare with read status
      const threadIds = threads.map(t => t.id);
      const { data: latestMessages } = await supabase
        .from('promoter_venue_messages')
        .select('thread_id, sent_at')
        .in('thread_id', threadIds)
        .order('sent_at', { ascending: false });

      // Group latest messages by thread_id
      const latestMessageMap = new Map();
      latestMessages?.forEach(msg => {
        if (!latestMessageMap.has(msg.thread_id)) {
          latestMessageMap.set(msg.thread_id, msg.sent_at);
        }
      });

      return threads.map(thread => {
        const readStatus = readStatusData?.find(status => status.thread_id === thread.id);
        const latestMessageTime = latestMessageMap.get(thread.id);
        
        // Thread is read if:
        // 1. There's a read status record AND
        // 2. The read timestamp is after the latest message timestamp (or no messages exist)
        const isRead = readStatus && (!latestMessageTime || 
          new Date(readStatus.last_read_at) >= new Date(latestMessageTime));

        return {
          ...thread,
          isRead: !!isRead
        };
      });
    } catch (err) {
      console.error('Error fetching read status:', err);
      return threads;
    }
  }, [userId]);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: userId,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

      if (error) throw error;

    } catch (err: any) {
      console.error('Error marking thread as read:', err);
      toast({
        title: "Error",
        description: "Failed to update conversation status.",
        variant: "destructive"
      });
    }
  }, [userId, toast]);

  const subscribeToReadStatusUpdates = useCallback((threadIds: string[], onUpdate: () => void) => {
    if (!userId || threadIds.length === 0) return null;

    const channel = supabase
      .channel(`read-status-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_read_status',
          filter: `user_id=eq.${userId}`
        },
        () => {
          console.log('Read status updated, triggering refresh');
          onUpdate();
        }
      )
      .subscribe();

    return channel;
  }, [userId]);

  return {
    updateThreadReadStatus,
    markThreadAsRead,
    subscribeToReadStatusUpdates
  };
};
