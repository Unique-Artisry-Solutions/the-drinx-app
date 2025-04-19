
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

      if (error) throw error;

      const messagesWithSenders = await Promise.all(data.map(async (msg) => {
        try {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .eq('id', msg.sender_id)
            .single();
          
          if (senderError) {
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

