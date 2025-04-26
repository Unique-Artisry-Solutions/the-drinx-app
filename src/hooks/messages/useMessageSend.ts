
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';

export const useMessageSend = (fetchThreads: () => Promise<void>) => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }
      
      console.log(`Sending message to thread ${threadId}: ${content}`);
      
      const { error } = await executeWithRetry(async () =>
        supabase
          .from('promoter_venue_messages')
          .insert({
            thread_id: threadId,
            content: content.trim(),
            sender_id: user.data.user.id,
            is_from_promoter: false
          })
      );

      if (error) throw error;
      await fetchThreads();

    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchThreads, executeWithRetry, toast]);

  return sendMessage;
};
