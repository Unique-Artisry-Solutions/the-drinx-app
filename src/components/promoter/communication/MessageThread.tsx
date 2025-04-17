
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Send, ArrowLeft, Archive } from 'lucide-react';
import { Message } from '@/hooks/promoter/types';

interface MessageThreadProps {
  venueName: string;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onArchive: () => void;
  eventName?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  venueName,
  messages,
  onBack,
  onSendMessage,
  onArchive,
  eventName
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className="flex-1">
            <div className="flex flex-col">
              <span>{venueName}</span>
              {eventName && (
                <span className="text-xs text-muted-foreground">Re: {eventName}</span>
              )}
            </div>
          </CardTitle>
          
          <Button variant="ghost" size="icon" onClick={onArchive} title="Archive conversation">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.isFromPromoter ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                message.isFromPromoter 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="text-xs mb-1">
                {message.senderName} • {format(new Date(message.timestamp), 'h:mm a')}
              </div>
              <div className="text-sm">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageThread;
