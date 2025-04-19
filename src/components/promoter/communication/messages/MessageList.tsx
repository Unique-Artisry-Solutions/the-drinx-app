
import React, { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/hooks/messages/types';

interface MessageListProps {
  messages: Message[];
  userId: string | undefined;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isSentByCurrentUser = message.sender_id === userId;
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
  );
};

export default MessageList;
