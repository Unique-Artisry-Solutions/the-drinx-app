
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Log the user ID for debugging
      console.log('Fetching threads for user:', user.id, 'as', userType);
      
      const { data: threadsData, error: threadError } = await supabase
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

      if (threadError) throw threadError;

      if (!threadsData || threadsData.length === 0) {
        setThreads([]);
        setLoading(false);
        return;
      }

      const venueIds = threadsData.map(thread => thread.venue_id).filter(Boolean);
      const { data: venueData, error: venueError } = await supabase
        .from('establishments')
        .select('id, name')
        .in('id', venueIds);
      
      if (venueError) throw venueError;

      const promoterIds = threadsData.map(thread => thread.promoter_id).filter(Boolean);
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

      // Create lookup maps from the data
      const venueMap = venueData?.reduce((acc, venue) => {
        if (venue && venue.id) {
          acc[venue.id] = venue;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      const promoterMap = promoterData?.reduce((acc, promoter) => {
        if (promoter && promoter.id) {
          acc[promoter.id] = promoter;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      const messageMap = messagesData?.reduce((acc, msg) => {
        if (msg && msg.thread_id && !acc[msg.thread_id]) {
          acc[msg.thread_id] = msg;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      const readStatusMap = readStatusData?.reduce((acc, status) => {
        if (status && status.thread_id) {
          acc[status.thread_id] = status;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      const formattedThreads: MessageThread[] = threadsData.map(thread => {
        let venueName = "Unknown Venue";
        if (thread.venue_id && venueMap[thread.venue_id]) {
          venueName = venueMap[thread.venue_id].name;
        }
        
        let promoterName = "Unknown Promoter";
        if (thread.promoter_id && promoterMap[thread.promoter_id]) {
          const promoter = promoterMap[thread.promoter_id];
          promoterName = promoter.display_name || promoter.username || "Unknown Promoter";
        }

        const lastMessage = messageMap[thread.id]?.content || "No messages yet";
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
      setError('Failed to load message threads. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load message threads. Please try again later.",
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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send messages.",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    try {
      console.log('Sending message with threadId:', threadId, 'content:', content);
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          content,
          sender_id: user.id,
          is_from_promoter: userType === 'promoter'
        });

      if (error) {
        console.error('Error in sendMessage:', error);
        throw error;
      }
      
      // Message sent successfully
      return threadId;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user, userType, toast]);

  const createThread = useCallback(async (venueId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to start conversations.",
        variant: "destructive",
      });
      throw new Error("Authentication required");
    }

    try {
      console.log('Creating thread between promoter:', user.id, 'and venue:', venueId);
      
      // First verify that the user has an active promoter role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .single();
        
      if (roleError) {
        console.error('Error checking promoter role:', roleError);
        throw new Error("Unable to verify promoter role. Please try refreshing the page.");
      }
        
      if (!roleData?.is_active) {
        // Try to activate the role if it exists but isn't active
        const { error: switchError } = await supabase.rpc('switch_active_role', {
          role_to_activate: 'promoter'
        });
        
        if (switchError) {
          console.error('Error activating role:', switchError);
          throw new Error("Could not activate promoter role. Please try again.");
        }
        
        // Update local storage
        localStorage.setItem('user_type', 'promoter');
      }
      
      // Check if a thread already exists
      const { data: existingThread, error: checkError } = await supabase
        .from('promoter_venue_threads')
        .select('id')
        .eq('promoter_id', user.id)
        .eq('venue_id', venueId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing thread:', checkError);
      }
      
      if (existingThread?.id) {
        console.log('Thread already exists, returning existing ID:', existingThread.id);
        return existingThread.id;
      }
      
      // Create new thread
      const { data: thread, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .insert({
          promoter_id: user.id,
          venue_id: venueId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (threadError) {
        console.error('Error creating thread:', threadError);
        
        // Add more specific error handling
        if (threadError.message?.includes('check_thread_participants')) {
          if (threadError.message?.includes('Invalid promoter_id')) {
            throw new Error("Your account doesn't have an active promoter role. Please refresh and try again.");
          } else if (threadError.message?.includes('Invalid venue_id')) {
            throw new Error("The selected venue doesn't exist or has been removed.");
          }
        }
        
        throw new Error("Could not create conversation. Please ensure you have a promoter role and try again.");
      }

      console.log('Thread created successfully:', thread.id);
      await fetchThreads();
      return thread.id;
    } catch (error: any) {
      console.error('Error in createThread:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation with venue. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, fetchThreads, toast]);

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
    if (user) {
      fetchThreads();
    } else {
      setThreads([]);
      setLoading(false);
    }
  }, [fetchThreads, user]);

  return {
    threads,
    loading,
    error,
    markThreadAsRead,
    sendMessage,
    selectedThreadId,
    setSelectedThreadId,
    refetchThreads: fetchThreads,
    createThread
  };
};
