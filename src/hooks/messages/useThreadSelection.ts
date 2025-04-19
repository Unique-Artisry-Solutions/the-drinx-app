
import { useState, useCallback } from 'react';
import { MessageThread } from './types';
import { useToast } from '@/hooks/use-toast';

export const useThreadSelection = (
  setThreads: (updater: (prev: MessageThread[]) => MessageThread[]) => void,
  markThreadAsRead: (threadId: string) => Promise<void>,
  fetchMessages: (threadId: string) => Promise<any[]>
) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectThread = useCallback(async (threadId: string) => {
    try {
      await markThreadAsRead(threadId);
      setSelectedThreadId(threadId);
      
      const messages = await fetchMessages(threadId);
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, messages, isRead: true } : thread
        )
      );
    } catch (err) {
      console.error('Error handling thread selection:', err);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    }
  }, [markThreadAsRead, fetchMessages, setThreads, toast]);

  return {
    selectedThreadId,
    setSelectedThreadId: handleSelectThread
  };
};
