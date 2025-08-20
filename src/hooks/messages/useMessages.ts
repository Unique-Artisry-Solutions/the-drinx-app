
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { Message, UserType } from './types';

export const useMessages = (userType: UserType) => {
  const { executeWithRetry } = useRetry();
  const { toast } = useToast();

  const fetchMessages = useCallback(async (threadId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await executeWithRetry(async () =>
        supabase
          .from('promoter_venue_messages')
          .select(`
            *,
            profiles!fk_promoter_venue_messages_sender_id(id, display_name, username)
          `)
          .eq('thread_id', threadId)
          .order('sent_at', { ascending: true })
      );

      if (messagesError) throw messagesError;

      const messages: Message[] = (messagesData || []).map(msg => ({
        id: msg.id,
        thread_id: msg.thread_id,
        content: msg.content,
        sent_at: msg.sent_at,
        created_at: msg.sent_at, // Map sent_at to created_at for compatibility
        sender_id: msg.sender_id,
        is_from_promoter: msg.is_from_promoter,
        is_read: false, // Default to false, will be updated by read status logic
        sender: msg.profiles || {
          display_name: 'Unknown',
          username: 'user'
        }
      }));

      return messages;
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      toast({
        title: "Error Loading Messages",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  }, [executeWithRetry, toast]);

  const sendMessage = useCallback(async (threadId: string, content: string, userId: string) => {
    if (!content.trim()) return;
    
    try {
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content: content.trim(),
          sender_id: userId,
          is_from_promoter: userType === 'promoter'
        });

      if (error) throw error;

    } catch (err: any) {
      console.error('Error sending message:', err);
      throw err; // Re-throw error so calling code can handle it properly
    }
  }, [userType]);

  return {
    fetchMessages,
    sendMessage
  };
};
