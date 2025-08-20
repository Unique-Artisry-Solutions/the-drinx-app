
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
    
    console.log('💬 Sending message to thread:', threadId, 'from user:', userId);
    
    try {
      // Validate inputs
      if (!threadId || !userId) {
        throw new Error("Missing required parameters for sending message");
      }

      // Validate UUID formats
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(threadId) || !uuidRegex.test(userId)) {
        throw new Error("Invalid thread ID or user ID format");
      }

      const { error } = await executeWithRetry(async () =>
        supabase
          .from('promoter_venue_messages')
          .insert({
            thread_id: threadId,
            content: content.trim(),
            sender_id: userId,
            is_from_promoter: userType === 'promoter'
          })
      );

      if (error) {
        console.error('💬 Message sending error:', error);
        throw error;
      }

      console.log('💬 Message sent successfully');

    } catch (err: any) {
      console.error('💬 Error sending message:', err);
      
      // Provide more specific error context
      if (err.message?.includes('Missing required parameters')) {
        throw new Error("Invalid message parameters. Please try refreshing the page.");
      } else if (err.message?.includes('Invalid thread ID')) {
        throw new Error("Invalid conversation. Please try starting a new conversation.");
      } else if (err.code === 'PGRST116') {
        throw new Error("Conversation not found. Please try starting a new conversation.");
      } else if (err.code?.startsWith('23')) {
        throw new Error("Database constraint error. Please contact support.");
      }
      
      throw err; // Re-throw with original error if no specific handling
    }
  }, [userType, executeWithRetry]);

  return {
    fetchMessages,
    sendMessage
  };
};
