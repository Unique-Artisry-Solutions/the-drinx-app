import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { Message, MessageThread } from '../promoter/types';

export const useMessageSystem = (userType: 'establishment') => {
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
      
      const { data: userEstablishments, error: establishmentsError } = await executeWithRetry(async () => 
        supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', currentUser.data.user.id)
      );

      if (establishmentsError) {
        console.error('Error fetching establishments:', establishmentsError);
        throw establishmentsError;
      }
      
      if (!userEstablishments || userEstablishments.length === 0) {
        setThreads([]);
        return;
      }

      const establishmentIds = userEstablishments.map(est => est.id);

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
            venues:establishments(id, name),
            promoters:profiles!promoter_id(id, display_name, username)
          `)
          .in('venue_id', establishmentIds)
          .order('last_message_at', { ascending: false })
      );

      if (threadsError) throw threadsError;
      
      const processedThreads: MessageThread[] = [];
      
      for (const thread of threadsData || []) {
        try {
          const { data: messagesData, error: messagesError } = await executeWithRetry(async () =>
            supabase
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
              .limit(20)
          );
            
          if (messagesError) {
            console.error('Error fetching messages:', messagesError);
            throw messagesError;
          }
          
          const messages: Message[] = [];
          for (const msg of messagesData || []) {
            try {
              const { data: senderData, error: senderError } = await executeWithRetry(async () =>
                supabase
                  .from('profiles')
                  .select('display_name, username')
                  .eq('id', msg.sender_id)
                  .maybeSingle()
              );
                
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
          
          const { data: readStatusData, error: readStatusError } = await executeWithRetry(async () =>
            supabase
              .from('message_read_status')
              .select('*')
              .eq('thread_id', thread.id)
              .eq('user_id', currentUser.data.user.id)
          );
          
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
            venueName: thread.venues?.name || undefined,
            messages: messages.reverse()
          });
        } catch (err) {
          console.error(`Error processing thread ${thread.id}:`, err);
          toast({
            title: "Error Loading Messages",
            description: "Some messages couldn't be loaded. Please try again.",
            variant: "destructive"
          });
        }
      }

      setThreads(processedThreads);
    } catch (err: any) {
      console.error('Error fetching establishment threads:', err);
      setError(err.message || 'Failed to load conversations');
      toast({
        title: "Error Loading Conversations",
        description: "Failed to load your conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [executeWithRetry, toast]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

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
  }, [fetchThreads, executeWithRetry, toast]);

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
  }, [executeWithRetry, toast]);

  const refetchThreads = useCallback(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    sendMessage,
    markThreadAsRead,
    refetchThreads,
    selectedThreadId,
    setSelectedThreadId
  };
};
