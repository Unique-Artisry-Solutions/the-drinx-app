
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Archive, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId, userType = 'promoter' }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { sendMessage } = useMessageSystem(userType);
  const [threadInfo, setThreadInfo] = useState({ venueName: '', promoterName: '', subject: '' });

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('promoter_venue_messages')
        .select(`
          *,
          sender:sender_id (id)
        `)
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      // Get sender details
      const senderIds = data?.map(msg => msg.sender_id) || [];
      const { data: senderData, error: senderError } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', senderIds);
      
      if (senderError) throw senderError;

      // Map sender details to messages
      const senderMap = senderData?.reduce((acc, sender) => {
        acc[sender.id] = sender;
        return acc;
      }, {} as Record<string, any>);

      const messagesWithSenders = data?.map(msg => ({
        ...msg,
        sender: senderMap?.[msg.sender_id] || { display_name: "Unknown", username: "user" }
      }));

      setMessages(messagesWithSenders || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  };

  useEffect(() => {
    const fetchThreadInfo = async () => {
      try {
        // Get thread details
        const { data: threadData, error: threadError } = await supabase
          .from('promoter_venue_threads')
          .select(`*`)
          .eq('id', threadId)
          .single();
  
        if (threadError) throw threadError;

        // Get venue details
        const { data: venueData, error: venueError } = await supabase
          .from('establishments')
          .select('name')
          .eq('id', threadData.venue_id)
          .single();

        if (venueError) throw venueError;

        // Get promoter details
        const { data: promoterData, error: promoterError } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', threadData.promoter_id)
          .single();

        if (promoterError) throw promoterError;
  
        setThreadInfo({
          venueName: venueData?.name || '',
          promoterName: promoterData?.display_name || promoterData?.username || '',
          subject: threadData?.subject || ''
        });
      } catch (err) {
        console.error('Error fetching thread info:', err);
        setError('Failed to load thread info');
      }
    };
  
    if (threadId) {
      fetchThreadInfo();
    }
  }, [threadId]);

  useEffect(() => {
    if (threadId) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'promoter_venue_messages',
            filter: `thread_id=eq.${threadId}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [threadId]);

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
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
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

      if (error) throw error;
      
      // Optionally refresh or redirect after archiving
    } catch (err) {
      console.error('Error archiving thread:', err);
      setError('Failed to archive conversation. Please try again.');
    }
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
          <Button variant="outline" size="sm" onClick={handleArchiveThread}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 mb-4 max-h-[500px]">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
                  <div className="text-sm">{message.content}</div>
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
      </CardContent>

      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim()}
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
