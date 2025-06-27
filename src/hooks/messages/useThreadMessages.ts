
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from './types';
import { useToast } from '@/hooks/use-toast';

export const useThreadMessages = (threadId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!threadId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: messagesData, error: messagesError } = await supabase
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

      if (messagesError) throw messagesError;

      const messagesWithSenders = await Promise.all(messagesData.map(async (msg) => {
        try {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .eq('id', msg.sender_id)
            .single();
          
          if (senderError) {
            return {
              id: msg.id,
              thread_id: msg.thread_id,
              content: msg.content,
              sent_at: msg.sent_at,
              created_at: msg.sent_at,
              sender_id: msg.sender_id,
              is_from_promoter: msg.is_from_promoter,
              is_read: false,
              sender: { display_name: "Unknown", username: "user" }
            };
          }

          return {
            id: msg.id,
            thread_id: msg.thread_id,
            content: msg.content,
            sent_at: msg.sent_at,
            created_at: msg.sent_at,
            sender_id: msg.sender_id,
            is_from_promoter: msg.is_from_promoter,
            is_read: false,
            sender: senderData
          };
        } catch (err) {
          console.error('Error processing sender:', err);
          return {
            id: msg.id,
            thread_id: msg.thread_id,
            content: msg.content,
            sent_at: msg.sent_at,
            created_at: msg.sent_at,
            sender_id: msg.sender_id,
            is_from_promoter: msg.is_from_promoter,
            is_read: false,
            sender: { display_name: "Unknown", username: "user" }
          };
        }
      }));

      setMessages(messagesWithSenders || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. ' + (err.message || ''));
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [threadId, toast]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    setError
  };
};
