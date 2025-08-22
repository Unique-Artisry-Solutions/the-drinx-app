
import React, { useRef, useEffect, memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/hooks/messages/types';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  userId: string | undefined;
  showDeliveryStatus?: boolean;
}

// Memoized status indicator component
const DeliveryStatusIcon = memo(({ status }: { status?: Message['status'] }) => {
  switch (status) {
    case 'sending':
      return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" aria-label="Sending" />;
    case 'sent':
      return <Check className="h-3 w-3 text-muted-foreground" aria-label="Sent" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-muted-foreground" aria-label="Delivered" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-primary" aria-label="Read" />;
    case 'failed':
      return <AlertCircle className="h-3 w-3 text-destructive" aria-label="Failed to send" />;
    default:
      return null;
  }
});

const MessageList: React.FC<MessageListProps> = memo(({ 
  messages, 
  userId, 
  showDeliveryStatus = true 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4" role="log" aria-live="polite" aria-label="Message history">
      {messages.map((message, index) => {
        const isSentByCurrentUser = message.sender_id === userId;
        const senderName = message.sender?.display_name || message.sender?.username || 'Unknown';
        const showSenderName = !isSentByCurrentUser || index === 0 || 
          messages[index - 1]?.sender_id !== message.sender_id;
        
        return (
          <div 
            key={message.id}
            className={cn(
              "flex",
              isSentByCurrentUser ? 'justify-end' : 'justify-start'
            )}
            role="article"
            aria-labelledby={`message-${message.id}-sender`}
          >
            <div className={cn(
              "max-w-[80%] p-3 rounded-lg transition-opacity",
              isSentByCurrentUser
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-foreground',
              message.isOptimistic && "opacity-70"
            )}>
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>
              <div className="flex items-center justify-between text-xs mt-2 opacity-70">
                <div className="flex items-center gap-1">
                  {showSenderName && (
                    <span id={`message-${message.id}-sender`}>
                      {isSentByCurrentUser ? 'You' : senderName}
                    </span>
                  )}
                  {message.read_at && (
                    <span className="text-xs opacity-50">
                      • Read {formatDistanceToNow(new Date(message.read_at), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span>
                    {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
                  </span>
                  {isSentByCurrentUser && showDeliveryStatus && (
                    <DeliveryStatusIcon status={message.status} />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
});

export default MessageList;
