
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Archive, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMessageSystem, FormattedMessage } from '@/hooks/establishment/useMessageSystem';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId, userType = 'promoter' }) => {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
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
      const messageData = await fetchThreadMessages(threadId);
      setMessages(messageData);
    };
    
    fetchData();
    
    // Set up a polling mechanism to periodically check for new messages
    const intervalId = setInterval(fetchData, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [threadId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !threadId) return;
    
    setSending(true);
    
    try {
      await sendMessage(threadId, newMessage);
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleArchiveThread = async () => {
    if (!threadId) return;
    await archiveThread(threadId);
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
        {!messages.length ? (
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
