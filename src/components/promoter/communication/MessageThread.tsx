
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Archive, MoreHorizontal } from 'lucide-react';
import { usePromoterMessages } from '@/hooks/promoter/usePromoterMessages';
import { Message } from '@/hooks/promoter/types';

interface MessageThreadProps {
  threadId: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId }) => {
  const { getMessageThread, sendMessage, archiveThread } = usePromoterMessages();
  const [thread, setThread] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (threadId) {
      const currentThread = getMessageThread(threadId);
      setThread(currentThread);
    }
  }, [threadId, getMessageThread]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && thread) {
      sendMessage(threadId, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!thread) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <p>Select a conversation to view messages</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {thread.venueName}
            {thread.eventName && ` - ${thread.eventName}`}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => archiveThread(threadId)}
              title="Archive conversation"
            >
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
            <Button variant="ghost" size="sm" title="More options">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((message: Message) => (
          <div 
            key={message.id} 
            className={`flex ${message.isFromPromoter ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isFromPromoter 
                  ? 'bg-purple-100 text-purple-900' 
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {message.isFromPromoter ? 'You' : message.senderName}
              </div>
              <div className="whitespace-pre-wrap">{message.text}</div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </CardContent>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageThread;
