
import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { MessageThread } from './types';

export const useThreadFetch = (userType: 'establishment') => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const processedThreads = await Promise.all((threadsData || []).map(async (thread) => {
        const messages = await fetchThreadMessages(thread.id);
        return {
          id: thread.id,
          venue_id: thread.venue_id,
          promoter_id: thread.promoter_id,
          subject: thread.subject || undefined,
          lastMessage: messages.length > 0 ? messages[0].content : 'No messages yet',
          timestamp: thread.last_message_at,
          isRead: false,
          isArchived: thread.is_archived,
          venueName: thread.venues?.name || undefined,
          messages: messages
        };
      }));

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
  }, [executeWithRetry, toast]);

  return {
    threads,
    setThreads,
    loading,
    error,
    fetchThreads
  };
};

const fetchThreadMessages = async (threadId: string) => {
  const { data: messagesData, error: messagesError } = await supabase
    .from('promoter_venue_messages')
    .select(`
      id,
      content,
      sent_at,
      sender_id,
      is_from_promoter
    `)
    .eq('thread_id', threadId)
    .order('sent_at', { ascending: false })
    .limit(20);

  if (messagesError) throw messagesError;

  const messages = [];
  for (const msg of messagesData || []) {
    try {
      const { data: senderData } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', msg.sender_id)
        .maybeSingle();
      
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
  return messages;
};
