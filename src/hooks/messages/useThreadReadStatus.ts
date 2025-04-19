
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '../use-toast';
import { MessageThread } from './types';

export const useThreadReadStatus = (userId: string | undefined) => {
  const { toast } = useToast();

  const updateThreadReadStatus = useCallback(async (threads: MessageThread[]) => {
    if (!userId) return threads;

    try {
      const { data: readStatusData } = await supabase
        .from('message_read_status')
        .select('*')
        .in('thread_id', threads.map(t => t.id))
        .eq('user_id', userId);

      return threads.map(thread => ({
        ...thread,
        isRead: readStatusData?.some(status => status.thread_id === thread.id) ?? false
      }));
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

  return {
    updateThreadReadStatus,
    markThreadAsRead
  };
};
