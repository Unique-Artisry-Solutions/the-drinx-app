
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Archive, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMessageSystem, FormattedMessage } from '@/hooks/establishment/useMessageSystem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId, userType = 'promoter' }) => {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    threadInfo,
    archiveThread,
    fetchThreadMessages,
    sendMessage
  } = useMessageSystem(userType);

  useEffect(() => {
    if (!threadId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching messages for thread: ${threadId}`);
        const messageData = await fetchThreadMessages(threadId);
        console.log(`Received ${messageData.length} messages`);
        setMessages(messageData);
      } catch (err) {
        console.error('Error fetching thread messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up a polling mechanism to periodically check for new messages
    const intervalId = setInterval(fetchData, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [threadId, fetchThreadMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadId) return;
    
    setSending(true);
    setError(null);
    
    try {
      console.log(`Sending message to thread: ${threadId}`);
      await sendMessage(threadId, newMessage);
      console.log('Message sent successfully');
      setNewMessage('');
      
      // Immediately fetch updated messages
      const messageData = await fetchThreadMessages(threadId);
      setMessages(messageData);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleArchiveThread = async () => {
    if (!threadId) return;
    
    try {
      await archiveThread(threadId);
    } catch (err) {
      console.error('Error archiving thread:', err);
      setError('Failed to archive conversation. Please try again.');
    }
  };

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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-6">
            <p>Loading messages...</p>
          </div>
        ) : !messages.length ? (
          <div className="text-center py-6 text-gray-500">
            <p>No messages in this conversation yet</p>
            <p className="text-sm mt-2">Start the conversation by sending a message below</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isSentByCurrentUser = 
                userType === 'promoter' ? message.isFromPromoter : !message.isFromPromoter;
              
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
                    <div className="text-sm">
                      {message.text}
                    </div>
                    <div className="flex items-center text-xs mt-1 text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
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
