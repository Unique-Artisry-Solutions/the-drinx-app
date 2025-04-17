import { useEffect, useState } from 'react';
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
  venues?: MessageVenue | MessageVenue[];
  promoters?: MessageSender | MessageSender[];
  profiles?: MessageSender | MessageSender[];
  promoter_venue_messages?: MessageData[];
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
          promoter_venue_messages (
            id,
            content,
            sent_at,
            is_from_promoter,
            sender_id
          ),
          profiles!promoter_venue_threads_promoter_id_fkey (
            display_name,
            username
          )
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

      const formattedThreads: FormattedThread[] = (threadData as ThreadData[]).map(thread => {
        const promoterProfile = thread.profiles || {};
        // Access properties safely
        let promoterName = 'Promoter';
        
        // Handle array or single object structure for profiles
        if (Array.isArray(promoterProfile)) {
          const profile = promoterProfile[0] || {};
          promoterName = (profile.display_name as string) || 
                        (profile.username as string) || 
                        'Promoter';
        } else {
          promoterName = (promoterProfile.display_name as string) || 
                        (promoterProfile.username as string) || 
                        'Promoter';
        }
        
        const messages = thread.promoter_venue_messages || [];
        const lastMessage = messages.length > 0 
          ? messages.sort((a, b) => 
              new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
            )[0].content
          : 'No messages yet';
        
        const lastReadAt = readStatusMap.get(thread.id);
        const lastMessageAt = thread.last_message_at;
        const isRead = !lastMessageAt || (lastReadAt && new Date(lastReadAt) >= new Date(lastMessageAt));
        
        return {
          id: thread.id,
          venueName: promoterName,
          eventName: thread.subject || undefined,
          lastMessage,
          timestamp: thread.last_message_at,
          isRead: isRead,
          isArchived: thread.is_archived,
          messages: []
        };
      });

      setThreads(formattedThreads);
      
    } catch (error) {
      console.error('Error fetching establishment:', error);
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
    // Implementation for promoter threads would go here
    // Similar to fetchEstablishmentThreads but querying threads where promoter_id = user.id
  };

  const fetchThreadMessages = async (threadId: string): Promise<FormattedMessage[]> => {
    try {
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select(`
          id, subject,
          venues:establishments(id, name),
          promoters:profiles!promoter_venue_threads_promoter_id_fkey(id, display_name, username)
        `)
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

      // Cast to a temporary type that can handle array properties
      interface ThreadDataResponse {
        id: string;
        subject?: string | null;
        venues?: { id?: string; name?: string; }[];
        promoters?: { id?: string; display_name?: string; username?: string; }[];
      }

      // Type safe handling of potentially array-structured responses
      const threadTyped = threadData as unknown as ThreadDataResponse;
      
      // Handle venues and promoters as arrays
      const venuesArray = threadTyped.venues || [];
      const promotersArray = threadTyped.promoters || [];
      
      const venueName = venuesArray.length > 0 ? (venuesArray[0].name as string) || 'Venue' : 'Venue';
      const promoterName = promotersArray.length > 0 
        ? (promotersArray[0].display_name as string) || (promotersArray[0].username as string) || 'Promoter' 
        : 'Promoter';

      setThreadInfo({
        venueName: venueName,
        promoterName: promoterName,
        subject: threadTyped.subject || undefined
      });

      const { data: messageData, error: messageError } = await supabase
        .from('promoter_venue_messages')
        .select(`
          id,
          content,
          sent_at,
          sender_id,
          is_from_promoter,
          sender:profiles!promoter_venue_messages_sender_id_fkey(username, display_name)
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

      // Listen for new messages
      setupMessageListener(threadId);

      // Mark thread as read
      if (user) {
        await markThreadAsRead(threadId);
      }

      return (messageData as MessageData[]).map(message => {
        const senderData = message.sender || {};
        let senderName = 'Unknown';
        
        // Handle sender as potential array
        if (Array.isArray(senderData)) {
          const sender = senderData[0] || {};
          senderName = (sender.display_name as string) || (sender.username as string) || 'Unknown';
        } else {
          senderName = (senderData.display_name as string) || (senderData.username as string) || 'Unknown';
        }
        
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

  const setupMessageListener = (threadId: string) => {
    const channel = supabase
      .channel('thread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promoter_venue_messages',
          filter: `thread_id=eq.${threadId}`
        },
        async (payload) => {
          const { data: newMessage, error } = await supabase
            .from('promoter_venue_messages')
            .select(`
              id,
              content,
              sent_at,
              sender_id,
              is_from_promoter,
              sender:profiles!promoter_venue_messages_sender_id_fkey(username, display_name)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (error) {
            console.error('Error fetching new message:', error);
            return;
          }
          
          // Cast to our strongly typed interface
          const messageTyped = newMessage as MessageData;
          const senderData = messageTyped.sender || {};
          let senderName = 'Unknown';
          
          // Handle potential array structure
          if (Array.isArray(senderData)) {
            const sender = senderData[0] || {};
            senderName = (sender.display_name as string) || (sender.username as string) || 'Unknown';
          } else {
            senderName = (senderData.display_name as string) || (senderData.username as string) || 'Unknown';
          }
          
          // We'd handle the message here
          // This would update local state with the new message
          
          if (messageTyped.sender_id !== user?.id) {
            await markThreadAsRead(threadId);
          }
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markThreadAsRead = async (threadId: string) => {
    if (!user) return;
    
    try {
      await supabase.rpc('mark_thread_as_read', {
        _thread_id: threadId,
        _user_id: user.id
      });

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
      const isFromPromoter = userType === 'promoter';
      
      const { error } = await supabase
        .from('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: content,
          is_from_promoter: isFromPromoter
        });

      if (error) {
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
