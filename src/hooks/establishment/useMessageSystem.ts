
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '../useRetry';
import { useToast } from '../use-toast';
import { MessageThread, Message } from '../messages/useMessageSystem';

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
      // For establishments, we need to query threads where venue_id matches establishments they own
      const { data: userEstablishments, error: establishmentsError } = await supabase
        .from('establishments')
        .select('id')
        .eq('owner_id', currentUser.data.user?.id);

      if (establishmentsError) throw establishmentsError;
      if (!userEstablishments || userEstablishments.length === 0) {
        setThreads([]);
        return;
      }

      const establishmentIds = userEstablishments.map(est => est.id);

      // Now fetch threads for these establishments
      const { data: threadsData, error: threadsError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          *,
          venues:establishments(id, name),
          promoters:profiles!promoter_id(id, display_name, username),
          promoter_venue_messages!inner(
            id,
            content,
            sent_at,
            sender_id,
            is_from_promoter,
            sender:profiles(display_name, username)
          )
        `)
        .in('venue_id', establishmentIds)
        .order('last_message_at', { ascending: false });

      if (threadsError) throw threadsError;
      
      // Get read status information
      const { data: readStatusData } = await supabase
        .from('message_read_status')
        .select('*')
        .eq('user_id', currentUser.data.user?.id);
      
      const readStatusMap = (readStatusData || []).reduce((acc, status) => {
        acc[status.thread_id] = status.last_read_at;
        return acc;
      }, {} as Record<string, string>);

      const processedThreads: MessageThread[] = threadsData?.map(thread => {
        // Check if thread is read based on read status data
        const isRead = readStatusMap[thread.id] ? true : false;
        
        return {
          id: thread.id,
          venue_id: thread.venue_id,
          promoter_id: thread.promoter_id,
          subject: thread.subject || undefined,
          lastMessage: thread.promoter_venue_messages[0]?.content,
          timestamp: thread.last_message_at,
          isRead,
          isArchived: thread.is_archived,
          venueName: thread.venues?.name,
          messages: thread.promoter_venue_messages?.map(msg => ({
            id: msg.id,
            content: msg.content,
            sent_at: msg.sent_at,
            sender_id: msg.sender_id,
            is_from_promoter: msg.is_from_promoter,
            sender: {
              display_name: msg.sender?.display_name,
              username: msg.sender?.username
            }
          })) || []
        };
      }) || [];

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
  }, [toast]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const sendMessage = useCallback(async (threadId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content: content.trim(),
          sender_id: user.data.user?.id,
          is_from_promoter: false // Always false for establishment
        });

      if (error) throw error;

      // Refresh threads to get the latest messages
      await fetchThreads();
    } catch (err: any) {
      console.error('Error sending message:', err);
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchThreads, toast]);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    try {
      const user = await supabase.auth.getUser();
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.data.user?.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

      if (error) throw error;

      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, isRead: true } : thread
        )
      );
      
      // Also select this thread
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
    loading,
    error,
    sendMessage,
    markThreadAsRead,
    refetchThreads,
    selectedThreadId,
    setSelectedThreadId
  };
};
