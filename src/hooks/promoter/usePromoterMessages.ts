
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageThread } from '../messages/types';
import { useToast } from '../use-toast';

export const usePromoterMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const { data: threadsData, error: threadsError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id,
          promoter_id,
          venue_id,
          subject,
          is_archived,
          last_message_at,
          venues:establishments(name)
        `)
        .eq('promoter_id', userId)
        .order('last_message_at', { ascending: false });

      if (threadsError) throw threadsError;

      const threads: MessageThread[] = (threadsData || []).map(thread => ({
        id: thread.id,
        promoter_id: thread.promoter_id,
        venue_id: thread.venue_id,
        subject: thread.subject,
        timestamp: thread.last_message_at,
        isRead: false,
        isArchived: thread.is_archived,
        venueName: thread.venues?.name,
        lastMessage: ''
      }));

      setMessages(threads);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  return {
    messages,
    loading,
    error,
    fetchMessages
  };
};
