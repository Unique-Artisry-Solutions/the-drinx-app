
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface MessageThread {
  id: string;
  venueName: string;
  eventName?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
}

export const useMessageSystem = (userType: 'promoter' | 'establishment' = 'promoter') => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    if (!user) return;

    try {
      const { data: threadsData, error } = await supabase
        .from('promoter_venue_threads')
        .select(`
          *,
          venues:venue_id (
            name
          ),
          promoters:promoter_id (
            display_name,
            username
          ),
          messages:promoter_venue_messages (
            content,
            sent_at,
            sender_id
          )
        `)
        .order('last_message_at', { ascending: false })
        .eq(userType === 'promoter' ? 'promoter_id' : 'venue_id', user.id);

      if (error) throw error;

      const formattedThreads: MessageThread[] = threadsData.map(thread => ({
        id: thread.id,
        venueName: userType === 'promoter' ? thread.venues?.name : thread.promoters?.display_name || thread.promoters?.username || 'Unknown',
        lastMessage: thread.messages?.[0]?.content || 'No messages yet',
        timestamp: thread.last_message_at || thread.created_at,
        isRead: false, // Will be updated with read status check
        isArchived: thread.is_archived
      }));

      setThreads(formattedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast({
        title: "Error",
        description: "Failed to load message threads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, userType, toast]);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.id,
          last_read_at: new Date().toISOString()
        });

      if (error) throw error;

      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId ? { ...thread, isRead: true } : thread
        )
      );
    } catch (error) {
      console.error('Error marking thread as read:', error);
    }
  }, [user]);

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content,
          sender_id: user.id,
          is_from_promoter: userType === 'promoter'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user, userType]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('message-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promoter_venue_messages',
          filter: `thread_id=eq.${selectedThreadId}`
        },
        () => {
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedThreadId, fetchThreads]);

  // Initial fetch
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    markThreadAsRead,
    sendMessage,
    selectedThreadId,
    setSelectedThreadId,
    refetchThreads: fetchThreads
  };
};
