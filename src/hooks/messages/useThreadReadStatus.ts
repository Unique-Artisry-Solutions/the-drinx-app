
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { MessageThread } from './types';

export const useThreadReadStatus = (
  setThreads: React.Dispatch<React.SetStateAction<MessageThread[]>>,
  setSelectedThreadId: (id: string) => void
) => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();

  const markThreadAsRead = useCallback(async (threadId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }
      
      console.log(`Marking thread ${threadId} as read`);
      
      const { error } = await executeWithRetry(async () =>
        supabase
          .from('message_read_status')
          .upsert({
            thread_id: threadId,
            user_id: user.data.user.id,
            last_read_at: new Date().toISOString()
          }, {
            onConflict: 'thread_id,user_id'
          })
      );

      if (error) throw error;

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, isRead: true } : thread
        )
      );
      
      setSelectedThreadId(threadId);
    } catch (err: any) {
      console.error('Error marking thread as read:', err);
      toast({
        title: "Error",
        description: "Failed to update conversation status.",
        variant: "destructive"
      });
    }
  }, [executeWithRetry, setThreads, setSelectedThreadId, toast]);

  return markThreadAsRead;
};
