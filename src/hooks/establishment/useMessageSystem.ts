
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

// Strong type definitions
export interface MessageSender {
  id?: string;
  display_name?: string | null;
  username?: string | null;
}

export interface MessageVenue {
  id?: string;
  name?: string | null;
}

export interface MessageData {
  id: string;
  content: string;
  sent_at: string;
  sender_id: string;
  is_from_promoter: boolean;
  sender?: MessageSender;
}

export interface ThreadData {
  id: string;
  created_at: string;
  updated_at: string;
  subject?: string | null;
  last_message_at: string;
  is_archived: boolean;
  promoter_id: string;
  venue_id: string;
  promoter?: MessageSender;
  venue?: MessageVenue;
  messages?: MessageData[];
}

export interface FormattedMessage {
  id: string;
  text: string;
  timestamp: string;
  senderName: string;
  isFromPromoter: boolean;
  senderId?: string;
}

export interface FormattedThread {
  id: string;
  venueName: string;
  promoterName: string;
  eventName?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  messages: FormattedMessage[];
}

export interface ThreadInfo {
  venueName?: string;
  promoterName?: string;
  subject?: string;
}

interface UseMessageSystemReturn {
  threads: FormattedThread[];
  loading: boolean;
  threadInfo: ThreadInfo;
  selectedThreadId: string | null;
  setSelectedThreadId: (id: string | null) => void;
  markThreadAsRead: (threadId: string) => Promise<void>;
  archiveThread: (threadId: string) => Promise<void>;
  fetchThreadMessages: (threadId: string) => Promise<FormattedMessage[]>;
  sendMessage: (threadId: string, content: string) => Promise<void>;
}

/**
 * Hook for handling messaging functionality between establishments and promoters
 */
export const useMessageSystem = (userType: 'establishment' | 'promoter'): UseMessageSystemReturn => {
  const [threads, setThreads] = useState<FormattedThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadInfo, setThreadInfo] = useState<ThreadInfo>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchThreads();
  }, [user]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      if (userType === 'establishment') {
        await fetchEstablishmentThreads();
      } else {
        await fetchPromoterThreads();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEstablishmentThreads = async () => {
    if (!user) return;
    
    try {
      // Check if we're using admin bypass
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      const userType = localStorage.getItem('user_type');
      let establishmentId;
      
      if (isAdminBypass && userType === 'establishment') {
        // For establishment admin bypass, fetch any establishment for demo purposes
        const { data: anyEstablishment, error: sampleError } = await supabase
          .from('establishments')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (sampleError) throw sampleError;

        if (anyEstablishment) {
          console.log("Using sample establishment ID for admin bypass:", anyEstablishment.id);
          establishmentId = anyEstablishment.id;
          
          toast({
            title: "Using demo establishment",
            description: "Using sample establishment data for admin bypass mode.",
            variant: "default"
          });
        } else {
          throw new Error("No establishments found in the database");
        }
      } else {
        // Regular flow - fetch the establishment owned by the current user
        const { data: establishment, error: establishmentError } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (establishmentError) throw establishmentError;

        if (establishment) {
          console.log("Found user's establishment:", establishment.id);
          establishmentId = establishment.id;
        } else {
          console.log("No establishment found for user, looking for a sample establishment");
          // For demo purposes, use a default ID if no establishment is found
          const { data: anyEstablishment, error: fetchError } = await supabase
            .from('establishments')
            .select('id')
            .limit(1)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (anyEstablishment) {
            console.log("Using sample establishment ID for demo:", anyEstablishment.id);
            establishmentId = anyEstablishment.id;
            
            toast({
              title: "Using demo establishment",
              description: "No establishment found for your account. Using sample data instead.",
              variant: "default"
            });
          } else {
            throw new Error("No establishments found in the database");
          }
        }
      }
      
      if (!establishmentId) {
        throw new Error("Could not determine establishment ID");
      }

      // Modified query approach that doesn't depend on explicit foreign key relations
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id,
          created_at,
          updated_at,
          subject,
          last_message_at,
          is_archived,
          promoter_id,
          venue_id
        `)
        .eq('venue_id', establishmentId)
        .order('last_message_at', { ascending: false });

      if (threadError) {
        console.error('Error fetching threads:', threadError);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive'
        });
        return;
      }

      console.log("Thread data retrieved:", threadData);

      // Fetch promoter profiles separately
      const promoterIds = threadData.map(thread => thread.promoter_id);
      const { data: promoterProfiles, error: promoterError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', promoterIds);

      if (promoterError) {
        console.error('Error fetching promoter profiles:', promoterError);
      }

      console.log("Promoter profiles retrieved:", promoterProfiles);

      // Create a map of promoter profiles for easy lookup
      const promoterMap = new Map();
      if (promoterProfiles) {
        promoterProfiles.forEach(profile => {
          promoterMap.set(profile.id, profile);
        });
      }

      // Get last messages for each thread
      const { data: lastMessagesData, error: lastMessagesError } = await supabase
        .from('promoter_venue_messages')
        .select('id, thread_id, content, sent_at')
        .in('thread_id', threadData.map(t => t.id))
        .order('sent_at', { ascending: false });

      if (lastMessagesError) {
        console.error('Error fetching last messages:', lastMessagesError);
      }

      // Group messages by thread_id and get the latest one for each thread
      const threadMessages = new Map();
      if (lastMessagesData) {
        lastMessagesData.forEach(msg => {
          if (!threadMessages.has(msg.thread_id) || 
              new Date(msg.sent_at) > new Date(threadMessages.get(msg.thread_id).sent_at)) {
            threadMessages.set(msg.thread_id, msg);
          }
        });
      }

      // Since we're querying read status directly, we need to handle the response as a direct DB query
      const { data: unreadData } = await supabase
        .from('message_read_status')
        .select('thread_id, last_read_at')
        .eq('user_id', user.id);

      const readStatusMap = new Map();
      if (unreadData) {
        unreadData.forEach(item => {
          readStatusMap.set(item.thread_id, item.last_read_at);
        });
      }

      const formattedThreads: FormattedThread[] = threadData.map(thread => {
        // Get promoter info
        const promoterProfile = promoterMap.get(thread.promoter_id) || {};
        const promoterName = promoterProfile.display_name || promoterProfile.username || 'Promoter';
        
        // Get last message
        const lastMessageObj = threadMessages.get(thread.id);
        const lastMessage = lastMessageObj ? lastMessageObj.content : 'No messages yet';
        
        // Determine read status
        const lastReadAt = readStatusMap.get(thread.id);
        const lastMessageAt = thread.last_message_at;
        const isRead = !lastMessageAt || (lastReadAt && new Date(lastReadAt) >= new Date(lastMessageAt));
        
        return {
          id: thread.id,
          venueName: promoterName,
          promoterName: promoterName, // Added for consistency
          eventName: thread.subject || undefined,
          lastMessage,
          timestamp: thread.last_message_at,
          isRead: isRead,
          isArchived: thread.is_archived,
          messages: []
        };
      });

      console.log("Formatted threads:", formattedThreads);
      setThreads(formattedThreads);
      
    } catch (error) {
      console.error('Error fetching establishment threads:', error);
      toast({
        title: 'Error',
        description: 'Could not find your establishment profile',
        variant: 'destructive'
      });
      // Set empty threads array to prevent UI from waiting indefinitely
      setThreads([]);
    }
  };

  const fetchPromoterThreads = async () => {
    // Similar implementation for promoter threads would go here
    // For now, we'll just set empty threads to prevent errors
    setThreads([]);
  };

  const fetchThreadMessages = async (threadId: string): Promise<FormattedMessage[]> => {
    try {
      console.log(`Fetching thread details for threadId: ${threadId}`);
      // Get basic thread info
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select('id, subject, venue_id, promoter_id')
        .eq('id', threadId)
        .single();

      if (threadError) {
        console.error('Error fetching thread:', threadError);
        toast({
          title: 'Error',
          description: 'Failed to load conversation details',
          variant: 'destructive'
        });
        return [];
      }

      console.log("Thread details retrieved:", threadData);

      // Fetch venue and promoter information separately
      const { data: venueData, error: venueError } = await supabase
        .from('establishments')
        .select('id, name')
        .eq('id', threadData.venue_id)
        .single();

      if (venueError) {
        console.error('Error fetching venue:', venueError);
      }
      
      const { data: promoterData, error: promoterError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .eq('id', threadData.promoter_id)
        .single();

      if (promoterError) {
        console.error('Error fetching promoter:', promoterError);
      }

      console.log("Venue data:", venueData);
      console.log("Promoter data:", promoterData);

      // Set thread info for display
      const venueName = venueData?.name || 'Venue';
      const promoterName = 
        (promoterData?.display_name || promoterData?.username || 'Promoter');

      setThreadInfo({
        venueName,
        promoterName,
        subject: threadData.subject || undefined
      });

      console.log(`Fetching messages for threadId: ${threadId}`);
      // Get messages for this thread
      const { data: messageData, error: messageError } = await supabase
        .from('promoter_venue_messages')
        .select(`
          id,
          content,
          sent_at,
          sender_id,
          is_from_promoter
        `)
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true });

      if (messageError) {
        console.error('Error fetching messages:', messageError);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive'
        });
        return [];
      }

      console.log(`Retrieved ${messageData?.length || 0} messages`);

      // Fetch all sender profiles in one batch
      const senderIds = [...new Set(messageData?.map(msg => msg.sender_id) || [])];
      const { data: senderProfiles, error: senderError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', senderIds);

      if (senderError) {
        console.error('Error fetching sender profiles:', senderError);
      }

      // Create a map for faster lookups
      const senderMap = new Map();
      if (senderProfiles) {
        senderProfiles.forEach(profile => {
          senderMap.set(profile.id, profile);
        });
      }

      // Mark thread as read
      if (user) {
        await markThreadAsRead(threadId);
      }

      // Return formatted messages
      return (messageData || []).map(message => {
        const senderProfile = senderMap.get(message.sender_id) || {};
        const senderName = senderProfile.display_name || senderProfile.username || 'Unknown';
        
        return {
          id: message.id,
          text: message.content,
          timestamp: message.sent_at,
          senderName: senderName,
          isFromPromoter: message.is_from_promoter,
          senderId: message.sender_id
        };
      });
    } catch (error) {
      console.error('Error in fetchThreadMessages:', error);
      return [];
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    if (!user) return;
    
    try {
      console.log(`Marking thread ${threadId} as read by user ${user.id}`);
      const { error } = await supabase
        .from('message_read_status')
        .upsert({
          thread_id: threadId,
          user_id: user.id,
          last_read_at: new Date().toISOString()
        }, {
          onConflict: 'thread_id,user_id'
        });

      if (error) {
        console.error('Error in upsert operation:', error);
        throw error;
      }

      setThreads(current => 
        current.map(thread => 
          thread.id === threadId 
            ? { ...thread, isRead: true } 
            : thread
        )
      );
    } catch (error) {
      console.error('Error marking thread as read:', error);
    }
  };

  const archiveThread = async (threadId: string) => {
    try {
      const { error } = await supabase
        .from('promoter_venue_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (error) {
        console.error('Error archiving thread:', error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Conversation archived',
      });
      
      // Update local state
      setThreads(current => 
        current.map(thread => 
          thread.id === threadId 
            ? { ...thread, isArchived: true } 
            : thread
        )
      );
    } catch (error) {
      console.error('Error archiving thread:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive conversation',
        variant: 'destructive'
      });
    }
  };

  const sendMessage = async (threadId: string, content: string) => {
    if (!content.trim() || !user || !threadId) return;
    
    try {
      console.log(`Sending message to thread ${threadId} by user ${user.id}`);
      console.log(`User type: ${userType}, is from promoter: ${userType === 'promoter'}`);
      
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: content,
          is_from_promoter: userType === 'promoter'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  return {
    threads,
    loading,
    threadInfo,
    selectedThreadId,
    setSelectedThreadId,
    markThreadAsRead,
    archiveThread,
    fetchThreadMessages,
    sendMessage
  };
};
