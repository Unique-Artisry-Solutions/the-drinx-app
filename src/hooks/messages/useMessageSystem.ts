import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { MessageThread } from '../promoter/types';

export const useMessageSystem = (userType: 'promoter' | 'establishment') => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('message_threads')
        .select('*');

      if (error) {
        console.error('Error fetching threads:', error);
        setError(error.message);
        toast({
          title: "Error Fetching Conversations",
          description: "Failed to load conversations. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setThreads(data);
    } catch (err: any) {
      console.error('Unexpected error fetching threads:', err);
      setError(err.message || 'An unexpected error occurred.');
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while loading conversations.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = useCallback(async (venueId: string) => {
    return executeWithRetry(async () => {
      console.log('Creating new thread for venue:', venueId);
      const { data, error } = await supabase.rpc('create_message_thread', { 
        venue_id: venueId 
      });

      if (error) {
        console.error('Error creating thread:', error);
        throw error;
      }

      console.log('Thread created successfully:', data);
      return data;
    }, (error) => {
      toast({
        title: "Error Creating Conversation",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive"
      });
    });
  }, [executeWithRetry, toast]);

  const sendMessage = useCallback(async (threadId: string, message: string) => {
    try {
      const { error } = await supabase.from('messages').insert({
        thread_id: threadId,
        content: message,
        sender_type: userType,
      });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error Sending Message",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      console.error('Unexpected error sending message:', err);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while sending the message.",
        variant: "destructive"
      });
    }
  }, [userType, toast]);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    try {
      const { error } = await supabase
        .from('message_threads')
        .update({ isRead: true })
        .eq('id', threadId);

      if (error) {
        console.error('Error marking thread as read:', error);
        toast({
          title: "Error",
          description: "Failed to update conversation status.",
          variant: "destructive"
        });
      } else {
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === threadId ? { ...thread, isRead: true } : thread
          )
        );
      }
    } catch (err: any) {
      console.error('Unexpected error marking thread as read:', err);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while updating conversation status.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const refetchThreads = useCallback(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    createThread,
    sendMessage,
    markThreadAsRead,
    refetchThreads
  };
};
