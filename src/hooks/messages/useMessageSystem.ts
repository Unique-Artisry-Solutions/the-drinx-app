
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';

// Export the types so they can be imported by other components
export interface Message {
  id: string;
  content: string;
  sent_at: string;
  sender_id: string;
  is_from_promoter: boolean;
  sender?: {
    display_name?: string;
    username?: string;
  };
}

export interface MessageThread {
  id: string;
  venue_id: string;
  promoter_id?: string;
  subject?: string;
  lastMessage?: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  venueName?: string;
  eventName?: string; // Added to match usage in MessageThreadList
  messages: Message[];
}

export const useMessageSystem = (userType: 'promoter' | 'establishment') => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = await supabase.auth.getUser();
      
      // First get all threads for the current user
      const { data: threadsData, error: threadsError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id,
          promoter_id,
          venue_id,
          subject,
          is_archived,
          last_message_at,
          venues:establishments(id, name)
        `)
        .eq('promoter_id', currentUser.data.user?.id)
        .order('last_message_at', { ascending: false });

      if (threadsError) throw threadsError;
      
      // Now get the latest message for each thread and the read status
      const processedThreads: MessageThread[] = [];
      
      for (const thread of threadsData || []) {
        // Get messages for this thread
        const { data: messagesData, error: messagesError } = await supabase
          .from('promoter_venue_messages')
          .select(`
            id,
            content,
            sent_at,
            sender_id,
            is_from_promoter
          `)
          .eq('thread_id', thread.id)
          .order('sent_at', { ascending: false })
          .limit(20);
          
        if (messagesError) throw messagesError;
        
        // For each message, get the sender info separately
        const messages: Message[] = [];
        for (const msg of messagesData || []) {
          // Get sender profile info
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('id', msg.sender_id)
            .single();
            
          if (senderError && senderError.code !== 'PGRST116') {
            console.error('Error fetching sender profile:', senderError);
          }
          
          messages.push({
            id: msg.id,
            content: msg.content,
            sent_at: msg.sent_at,
            sender_id: msg.sender_id,
            is_from_promoter: msg.is_from_promoter,
            sender: {
              display_name: senderData?.display_name,
              username: senderData?.username
            }
          });
        }
        
        // Get read status
        const { data: readStatusData } = await supabase
          .from('message_read_status')
          .select('*')
          .eq('thread_id', thread.id)
          .eq('user_id', currentUser.data.user?.id);
        
        const isRead = readStatusData && readStatusData.length > 0;
        
        processedThreads.push({
          id: thread.id,
          venue_id: thread.venue_id,
          promoter_id: thread.promoter_id,
          subject: thread.subject || undefined,
          lastMessage: messages[0]?.content || 'No messages yet',
          timestamp: thread.last_message_at,
          isRead: isRead,
          isArchived: thread.is_archived,
          venueName: thread.venues?.name,
          messages: messages.reverse() // Reverse to get ascending order
        });
      }

      setThreads(processedThreads);
    } catch (err: any) {
      console.error('Error fetching threads:', err);
      setError(err.message || 'Failed to load conversations');
      toast({
        title: "Error Loading Conversations",
        description: "Failed to load your conversations. Please try again.",
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
      try {
        const { data, error } = await supabase
          .from('promoter_venue_threads')
          .insert({
            venue_id: venueId,
            promoter_id: (await supabase.auth.getUser()).data.user?.id,
            is_archived: false
          })
          .select('id')
          .single();

        if (error) throw error;

        return data.id;
      } catch (err: any) {
        console.error('Error creating thread:', err);
        toast({
          title: "Error Creating Conversation",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive"
        });
        throw err;
      }
    });
  }, [executeWithRetry, toast]);

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content: content.trim(),
          sender_id: user.data.user?.id,
          is_from_promoter: userType === 'promoter'
        });

      if (error) throw error;

      // Refresh threads to get the latest messages
      await fetchThreads();
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [userType, fetchThreads, toast]);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.data.user?.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

      if (error) throw error;

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, isRead: true } : thread
        )
      );
    } catch (err: any) {
      console.error('Error marking thread as read:', err);
      toast({
        title: "Error",
        description: "Failed to update conversation status.",
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
    refetchThreads,
    selectedThreadId,
    setSelectedThreadId
  };
};
