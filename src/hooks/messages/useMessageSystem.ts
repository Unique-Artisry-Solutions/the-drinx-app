
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';

// Export the types so they can be imported by other components
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderName: string;
  isFromPromoter: boolean;
  senderId?: string;
}

export interface MessageThread {
  id: string;
  venueName: string;
  eventName?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  messages: Message[];
}

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
      // For now, use mock data instead of attempting to fetch from nonexistent tables
      const mockThreads: MessageThread[] = [];
      setThreads(mockThreads);
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
      
      // Instead of using non-existent RPC, use direct insert to promoter_venue_threads
      const { data, error } = await supabase
        .from('promoter_venue_threads')
        .insert({
          venue_id: venueId,
          promoter_id: (await supabase.auth.getUser()).data.user?.id,
          is_archived: false,
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating thread:', error);
        throw error;
      }

      console.log('Thread created successfully:', data);
      return data.id;
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
      const { error } = await supabase.from('promoter_venue_messages').insert({
        thread_id: threadId,
        content: message,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
        is_from_promoter: userType === 'promoter'
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
        .from('message_read_status')
        .upsert({ 
          thread_id: threadId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

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
