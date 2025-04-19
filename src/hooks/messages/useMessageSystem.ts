import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { Message, MessageThread } from '../promoter/types';

export const useMessageSystem = (userType: 'promoter' | 'establishment') => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuthenticatedUser();

  const fetchThreads = useCallback(async () => {
    if (authLoading || !user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data: threadsData, error: threadsError } = await executeWithRetry(async () =>
        supabase
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
          .eq('promoter_id', user.id)
          .order('last_message_at', { ascending: false })
      );

      if (threadsError) {
        console.error('Error fetching threads:', threadsError);
        throw threadsError;
      }

      const processedThreads: MessageThread[] = [];
      
      for (const thread of threadsData || []) {
        try {
          const { data: messagesData, error: messagesError } = await executeWithRetry(async () =>
            supabase
              .from('promoter_venue_messages')
              .select('*')
              .eq('thread_id', thread.id)
              .order('sent_at', { ascending: true })
          );

          if (messagesError) throw messagesError;

          const messages = await Promise.all((messagesData || []).map(async (msg) => {
            try {
              const { data: senderData } = await executeWithRetry(async () =>
                supabase
                  .from('profiles')
                  .select('display_name, username')
                  .eq('id', msg.sender_id)
                  .maybeSingle()
              );

              return {
                id: msg.id,
                content: msg.content,
                sent_at: msg.sent_at,
                sender_id: msg.sender_id,
                is_from_promoter: msg.is_from_promoter,
                sender: senderData || {
                  display_name: 'Unknown',
                  username: 'user'
                }
              };
            } catch (err) {
              console.error('Error processing message sender:', err);
              return null;
            }
          }));

          const validMessages = messages.filter(Boolean);

          const { data: readStatusData } = await executeWithRetry(async () =>
            supabase
              .from('message_read_status')
              .select('*')
              .eq('thread_id', thread.id)
              .eq('user_id', user.id)
          );

          processedThreads.push({
            id: thread.id,
            venue_id: thread.venue_id,
            promoter_id: thread.promoter_id,
            subject: thread.subject || undefined,
            lastMessage: validMessages.length > 0 ? validMessages[validMessages.length - 1].content : 'No messages yet',
            timestamp: thread.last_message_at,
            isRead: readStatusData && readStatusData.length > 0,
            isArchived: thread.is_archived,
            venueName: thread.venues?.name,
            messages: validMessages
          });
        } catch (err) {
          console.error(`Error processing thread ${thread.id}:`, err);
          toast({
            title: "Warning",
            description: `Some messages couldn't be loaded for thread with ${thread.venues?.name || 'Unknown Venue'}`,
            variant: "destructive"
          });
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
  }, [user, authLoading, executeWithRetry, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchThreads();
    }
  }, [fetchThreads, user, authLoading]);

  const createThread = useCallback(async (venueId: string) => {
    return executeWithRetry(async () => {
      try {
        const { data, error } = await supabase
          .from('promoter_venue_threads')
          .insert({
            venue_id: venueId,
            promoter_id: user.id,
            is_archived: false
          })
          .select('id')
          .single();

        if (error) {
          console.error('Error creating thread:', error);
          throw error;
        }

        await fetchThreads();
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
  }, [executeWithRetry, fetchThreads, user, toast]);

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content: content.trim(),
          sender_id: user.id,
          is_from_promoter: userType === 'promoter'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

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
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.id,
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
    loading: loading || authLoading,
    error,
    createThread,
    sendMessage,
    markThreadAsRead,
    refetchThreads,
    selectedThreadId,
    setSelectedThreadId
  };
};
