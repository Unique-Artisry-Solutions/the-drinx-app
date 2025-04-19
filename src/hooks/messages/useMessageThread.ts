import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, ThreadInfo } from './types';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';

export const useMessageThread = (threadId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threadInfo, setThreadInfo] = useState<ThreadInfo>({ 
    venueName: '', 
    promoterName: '', 
    subject: '' 
  });
  
  const { toast } = useToast();
  const channelRef = useRef<any>(null);
  const { executeWithRetry } = useRetry();

  const fetchMessages = useCallback(async () => {
    if (!threadId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('promoter_venue_messages')
        .select(`
          id,
          thread_id,
          content,
          sent_at,
          sender_id,
          is_from_promoter
        `)
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      const messagesWithSenders = await Promise.all(data.map(async (msg) => {
        try {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .eq('id', msg.sender_id)
            .single();
          
          if (senderError) {
            console.error('Error fetching sender profile:', senderError);
            return {
              ...msg,
              sender: { display_name: "Unknown", username: "user" }
            };
          }

          return {
            ...msg,
            sender: senderData
          };
        } catch (err) {
          console.error('Error processing sender:', err);
          return {
            ...msg,
            sender: { display_name: "Unknown", username: "user" }
          };
        }
      }));

      setMessages(messagesWithSenders || []);
      
      // Update read status
      if (messagesWithSenders && messagesWithSenders.length > 0) {
        try {
          const user = await supabase.auth.getUser();
          if (user.data.user) {
            await supabase
              .from('message_read_status')
              .upsert({
                thread_id: threadId,
                user_id: user.data.user.id,
                last_read_at: new Date().toISOString()
              }, {
                onConflict: 'thread_id,user_id'
              });
          }
        } catch (err) {
          console.error('Error marking thread as read:', err);
        }
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const fetchThreadInfo = useCallback(async () => {
    if (!threadId) return;
    
    try {
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id,
          subject,
          venue_id,
          promoter_id
        `)
        .eq('id', threadId)
        .single();

      if (threadError) {
        console.error('Error fetching thread info:', threadError);
        throw threadError;
      }

      const { data: venueData, error: venueError } = await supabase
        .from('establishments')
        .select('name')
        .eq('id', threadData.venue_id)
        .single();

      if (venueError && venueError.code !== 'PGRST116') {
        console.error('Error fetching venue info:', venueError);
      }

      const { data: promoterData, error: promoterError } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', threadData.promoter_id)
        .single();

      if (promoterError && promoterError.code !== 'PGRST116') {
        console.error('Error fetching promoter info:', promoterError);
      }

      setThreadInfo({
        venueName: venueData?.name || 'Unknown Venue',
        promoterName: promoterData?.display_name || promoterData?.username || 'Unknown Promoter',
        subject: threadData?.subject || ''
      });
    } catch (err: any) {
      console.error('Error fetching thread info:', err);
      setError('Failed to load conversation details: ' + (err.message || ''));
    }
  }, [threadId]);

  const handleArchiveThread = useCallback(async () => {
    if (!threadId) return;
    
    try {
      const { error } = await supabase
        .from('promoter_venue_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (error) throw error;
      
      toast({
        title: "Conversation Archived",
        description: "The conversation has been archived successfully.",
      });
    } catch (err: any) {
      console.error('Error archiving thread:', err);
      setError('Failed to archive conversation: ' + (err.message || ''));
      toast({
        title: "Error",
        description: "Failed to archive conversation. Please try again.",
        variant: "destructive"
      });
    }
  }, [threadId, toast]);

  const setupRealtimeSubscription = useCallback(() => {
    if (threadId) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      const channel = supabase
        .channel(`messages-${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('Received new message:', payload);
            fetchMessages();
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for thread ${threadId}:`, status);
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to thread ${threadId}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Error subscribing to thread ${threadId}`);
            setError('Failed to connect to real-time updates');
          }
        });

      channelRef.current = channel;
    }
  }, [threadId, fetchMessages]);

  const retryFetch = useCallback(async () => {
    setError(null);
    try {
      await executeWithRetry(async () => {
        await Promise.all([
          fetchThreadInfo(),
          fetchMessages()
        ]);
      });
    } catch (err: any) {
      setError('Failed to reload messages. Please try again.');
      toast({
        title: "Error",
        description: "Failed to reload messages. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchMessages, fetchThreadInfo, executeWithRetry, toast]);

  useEffect(() => {
    if (threadId) {
      retryFetch();
      setupRealtimeSubscription();

      return () => {
        if (channelRef.current) {
          console.log(`Cleaning up subscription for thread ${threadId}`);
          supabase.removeChannel(channelRef.current);
        }
      };
    }
  }, [threadId, retryFetch, setupRealtimeSubscription]);

  return {
    messages,
    loading,
    error,
    threadInfo,
    handleArchiveThread,
    fetchMessages,
    retryFetch
  };
};
