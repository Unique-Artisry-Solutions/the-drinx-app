
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Archive, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId, userType = 'promoter' }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

      // Get sender details separately for each message
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
      
      // Mark thread as read when messages are loaded
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
      
      // Auto-retry up to 3 times with increasing delays
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
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
        // Get thread details
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

        // Get venue details
        const { data: venueData, error: venueError } = await supabase
          .from('establishments')
          .select('name')
          .eq('id', threadData.venue_id)
          .single();

        if (venueError && venueError.code !== 'PGRST116') {
          console.error('Error fetching venue info:', venueError);
        }

        // Get promoter details
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
      // Clean up any existing subscription
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      // Set up real-time subscription
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadId || !user) return;
    
    setSending(true);
    setError(null);
    
    try {
      await sendMessage(threadId, newMessage.trim());
      setNewMessage('');
      // The real-time subscription should update the messages
      // But we'll also manually fetch to ensure it's updated
      setTimeout(() => fetchMessages(), 500);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Failed to send message: ' + (err.message || ''));
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleArchiveThread = async () => {
    if (!threadId) return;
    
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
        <div className="flex justify-between items-center">
          <CardTitle>
            {userType === 'promoter' 
              ? `Conversation with ${threadInfo.venueName || 'Venue'}`
              : `Conversation with ${threadInfo.promoterName || 'Promoter'}`
            }
            {threadInfo.subject && <span className="block text-sm font-normal text-gray-500 mt-1">Re: {threadInfo.subject}</span>}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleArchiveThread}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 mb-4 max-h-[500px]">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
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
          <div className="space-y-4">
            {messages.map((message) => {
              const isSentByCurrentUser = message.sender_id === user.id;
              const senderName = message.sender?.display_name || message.sender?.username || 'Unknown';
              
              return (
                <div 
                  key={message.id}
                  className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] p-3 rounded-lg 
                    ${isSentByCurrentUser 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'bg-gray-100 text-gray-800'}
                  `}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between text-xs mt-1 text-gray-500">
                      <span>{senderName}</span>
                      <span>{formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px]"
            disabled={loading || sending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim() || loading}
            className="self-end"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageThread;
