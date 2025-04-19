import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import MessageList from './messages/MessageList';
import MessageInput from './messages/MessageInput';
import ThreadHeader from './messages/ThreadHeader';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  threadId, 
  userType = 'promoter' 
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const { sendMessage } = useMessageSystem(userType as any);
  const [threadInfo, setThreadInfo] = useState({ venueName: '', promoterName: '', subject: '' });
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  const fetchMessages = async () => {
    if (!threadId || !user) return;

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

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      const messagesWithSenders = await Promise.all(data.map(async (msg) => {
        try {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .eq('id', msg.sender_id)
            .single();
          
          if (senderError) {
            console.error('Error fetching sender profile:', senderError);
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
      
      if (messagesWithSenders && messagesWithSenders.length > 0) {
        try {
          await supabase
            .from('message_read_status')
            .upsert({
              thread_id: threadId,
              user_id: user.id,
              last_read_at: new Date().toISOString()
            }, {
              onConflict: 'thread_id,user_id'
            });
        } catch (err) {
          console.error('Error marking thread as read:', err);
        }
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. ' + (err.message || ''));
      
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMessages();
        }, delay);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchThreadInfo = async () => {
      if (!threadId || !user) return;
      
      try {
        const { data: threadData, error: threadError } = await supabase
          .from('promoter_venue_threads')
          .select(`
            id,
            subject,
            venue_id,
            promoter_id
          `)
          .eq('id', threadId)
          .single();
  
        if (threadError) {
          console.error('Error fetching thread info:', threadError);
          throw threadError;
        }

        const { data: venueData, error: venueError } = await supabase
          .from('establishments')
          .select('name')
          .eq('id', threadData.venue_id)
          .single();

        if (venueError && venueError.code !== 'PGRST116') {
          console.error('Error fetching venue info:', venueError);
        }

        const { data: promoterData, error: promoterError } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', threadData.promoter_id)
          .single();

        if (promoterError && promoterError.code !== 'PGRST116') {
          console.error('Error fetching promoter info:', promoterError);
        }
  
        setThreadInfo({
          venueName: venueData?.name || 'Unknown Venue',
          promoterName: promoterData?.display_name || promoterData?.username || 'Unknown Promoter',
          subject: threadData?.subject || ''
        });
      } catch (err: any) {
        console.error('Error fetching thread info:', err);
        setError('Failed to load conversation details: ' + (err.message || ''));
      }
    };
  
    if (threadId) {
      setRetryCount(0);
      fetchThreadInfo();
      fetchMessages();
    }
  }, [threadId, user]);

  useEffect(() => {
    if (threadId && user) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      const channel = supabase
        .channel(`messages-${threadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          (payload) => {
            console.log('Received new message:', payload);
            fetchMessages();
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for thread ${threadId}:`, status);
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to thread ${threadId}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Error subscribing to thread ${threadId}`);
            setError('Failed to connect to real-time updates');
          }
        });

      channelRef.current = channel;

      return () => {
        console.log(`Cleaning up subscription for thread ${threadId}`);
        supabase.removeChannel(channel);
      };
    }
  }, [threadId, user]);

  const handleArchiveThread = async () => {
    if (!threadId) return;
    
    try {
      const { error } = await supabase
        .from('promoter_venue_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (error) throw error;
      
      toast({
        title: "Conversation Archived",
        description: "The conversation has been archived successfully.",
      });
    } catch (err: any) {
      console.error('Error archiving thread:', err);
      setError('Failed to archive conversation: ' + (err.message || ''));
      toast({
        title: "Error",
        description: "Failed to archive conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    setRetryCount(0);
    fetchMessages();
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to view messages.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <ThreadHeader
          venueName={threadInfo.venueName}
          subject={threadInfo.subject}
          onArchive={handleArchiveThread}
          onRefresh={handleRefresh}
          loading={loading}
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 mb-4 max-h-[500px]">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col gap-3 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-md w-3/4"></div>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages in this conversation yet</p>
            <p className="text-sm text-gray-400 mt-1">Type below to send the first message</p>
          </div>
        ) : (
          <MessageList messages={messages} userId={user.id} />
        )}
      </CardContent>

      <MessageInput
        onSendMessage={async (content) => {
          if (!threadId) return;
          await sendMessage(threadId, content);
          setTimeout(() => fetchMessages(), 500);
        }}
        disabled={loading}
      />
    </Card>
  );
};

export default MessageThread;
