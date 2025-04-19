
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMessageSending = (
  sendMessage: (threadId: string, content: string, userId: string) => Promise<void>,
  userId: string | undefined,
  onMessageSent: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleSendMessage = useCallback(async (threadId: string, content: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await sendMessage(threadId, content, userId);
      await onMessageSent();
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, sendMessage, onMessageSent, toast]);

  return handleSendMessage;
};
