
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
      if (!currentUser.data.user) {
        setThreads([]);
        setError("User not authenticated");
        return;
      }
      
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
          created_at,
          updated_at,
          venues:establishments(id, name)
        `)
        .eq('promoter_id', currentUser.data.user?.id)
        .order('last_message_at', { ascending: false });

      if (threadsError) {
        console.error('Error fetching threads:', threadsError);
        throw threadsError;
      }
      
      // Process threads without nested queries
      const processedThreads: MessageThread[] = [];
      
      for (const thread of threadsData || []) {
        try {
          // Get messages for this thread separately
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
            
          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            throw messagesError;
          }
          
          // For each message, get the sender info separately
          const messages: Message[] = [];
          for (const msg of messagesData || []) {
            try {
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
                sender: senderData || {
                  display_name: 'Unknown',
                  username: 'user'
                }
              });
            } catch (err) {
              console.error('Error processing message sender:', err);
              // Add message with default sender info
              messages.push({
                id: msg.id,
                content: msg.content,
                sent_at: msg.sent_at,
                sender_id: msg.sender_id,
                is_from_promoter: msg.is_from_promoter,
                sender: {
                  display_name: 'Unknown',
                  username: 'user'
                }
              });
            }
          }
          
          // Get read status
          const { data: readStatusData, error: readStatusError } = await supabase
            .from('message_read_status')
            .select('*')
            .eq('thread_id', thread.id)
            .eq('user_id', currentUser.data.user?.id);
          
          if (readStatusError) {
            console.error('Error fetching read status:', readStatusError);
          }
          
          const isRead = readStatusData && readStatusData.length > 0;
          
          processedThreads.push({
            id: thread.id,
            venue_id: thread.venue_id,
            promoter_id: thread.promoter_id,
            subject: thread.subject || undefined,
            lastMessage: messages.length > 0 ? messages[0].content : 'No messages yet',
            timestamp: thread.last_message_at,
            isRead: isRead,
            isArchived: thread.is_archived,
            venueName: thread.venues?.name,
            messages: messages.reverse() // Reverse to get ascending order
          });
        } catch (err) {
          console.error(`Error processing thread ${thread.id}:`, err);
          // Continue with other threads even if one fails
        }
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
        const currentUser = await supabase.auth.getUser();
        if (!currentUser.data.user) {
          throw new Error("User not authenticated");
        }
        
        const { data, error } = await supabase
          .from('promoter_venue_threads')
          .insert({
            venue_id: venueId,
            promoter_id: currentUser.data.user.id,
            is_archived: false
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error creating thread:', error);
          throw error;
        }

        await fetchThreads(); // Refresh threads list
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
  }, [executeWithRetry, fetchThreads, toast]);

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }
      
      console.log(`Sending message to thread ${threadId}: ${content}`);
      
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content: content.trim(),
          sender_id: user.data.user.id,
          is_from_promoter: userType === 'promoter'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

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
      if (!user.data.user) {
        throw new Error("User not authenticated");
      }
      
      console.log(`Marking thread ${threadId} as read`);
      
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.data.user.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

      if (error) {
        console.error('Error marking thread as read:', error);
        throw error;
      }

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, isRead: true } : thread
        )
      );
      
      // Also set this as the selected thread
      setSelectedThreadId(threadId);
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
