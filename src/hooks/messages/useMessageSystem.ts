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
          id, 
          subject,
          is_archived,
          created_at,
          updated_at,
          last_message_at,
          venue_id, 
          promoter_id
        `)
        .order('last_message_at', { ascending: false })
        .eq(userType === 'promoter' ? 'promoter_id' : 'venue_id', user.id);

      if (error) throw error;

      const venueIds = threadsData.map(thread => thread.venue_id);
      const { data: venueData, error: venueError } = await supabase
        .from('establishments')
        .select('id, name')
        .in('id', venueIds);
      
      if (venueError) throw venueError;

      const promoterIds = threadsData.map(thread => thread.promoter_id);
      const { data: promoterData, error: promoterError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', promoterIds);
      
      if (promoterError) throw promoterError;

      const threadIds = threadsData.map(thread => thread.id);
      const { data: messagesData, error: messagesError } = await supabase
        .from('promoter_venue_messages')
        .select('thread_id, content, sent_at')
        .in('thread_id', threadIds)
        .order('sent_at', { ascending: false });

      if (messagesError) throw messagesError;

      const { data: readStatusData, error: readStatusError } = await supabase
        .from('message_read_status')
        .select('thread_id, last_read_at')
        .eq('user_id', user.id)
        .in('thread_id', threadIds);

      if (readStatusError) throw readStatusError;

      const venueMap = venueData?.reduce((acc, venue) => {
        acc[venue.id] = venue;
        return acc;
      }, {} as Record<string, any>);

      const promoterMap = promoterData?.reduce((acc, promoter) => {
        acc[promoter.id] = promoter;
        return acc;
      }, {} as Record<string, any>);

      const messageMap = messagesData?.reduce((acc, msg) => {
        if (!acc[msg.thread_id]) {
          acc[msg.thread_id] = msg;
        }
        return acc;
      }, {} as Record<string, any>);

      const readStatusMap = readStatusData?.reduce((acc, status) => {
        acc[status.thread_id] = status;
        return acc;
      }, {} as Record<string, any>);

      const formattedThreads: MessageThread[] = threadsData.map(thread => {
        let venueName = "Unknown Venue";
        if (venueMap && thread.venue_id && venueMap[thread.venue_id]) {
          venueName = venueMap[thread.venue_id].name;
        }
        
        let promoterName = "Unknown Promoter";
        if (promoterMap && thread.promoter_id && promoterMap[thread.promoter_id]) {
          const promoter = promoterMap[thread.promoter_id];
          promoterName = promoter.display_name || promoter.username || "Unknown Promoter";
        }

        const lastMessage = messageMap?.[thread.id]?.content || "No messages yet";
        const timestamp = thread.last_message_at || thread.created_at;
        
        let isRead = false;
        if (readStatusMap && readStatusMap[thread.id]) {
          const readStatus = readStatusMap[thread.id];
          const lastReadAt = new Date(readStatus.last_read_at);
          const lastMessageAt = new Date(timestamp);
          isRead = lastReadAt >= lastMessageAt;
        }

        return {
          id: thread.id,
          venueName: userType === 'promoter' ? venueName : promoterName,
          lastMessage,
          timestamp,
          isRead,
          isArchived: thread.is_archived || false
        };
      });

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

  const createThread = async (venueId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data: thread, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .insert({
          promoter_id: userType === 'promoter' ? user.id : venueId,
          venue_id: userType === 'promoter' ? venueId : user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (threadError) throw threadError;

      await fetchThreads();
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  };

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
          filter: selectedThreadId ? `thread_id=eq.${selectedThreadId}` : undefined
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
    refetchThreads: fetchThreads,
    createThread
  };
};
