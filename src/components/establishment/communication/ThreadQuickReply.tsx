import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useThreadMessages } from '@/hooks/messages/useThreadMessages';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ThreadQuickReplyProps {
  threadId: string;
  userId?: string;
  onSendMessage: (threadId: string, content: string) => Promise<void>;
}

const ThreadQuickReply: React.FC<ThreadQuickReplyProps> = ({
  threadId,
  userId,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { messages, loading, fetchMessages } = useThreadMessages(threadId);

  // Fetch messages when component mounts
  useEffect(() => {
    if (threadId) {
      fetchMessages();
    }
  }, [threadId, fetchMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      await onSendMessage(threadId, newMessage.trim());
      setNewMessage('');
      // Refetch messages to show the new message
      await fetchMessages();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show last 5 messages
  const recentMessages = messages.slice(-5);

  return (
    <div className="p-4">
      {/* Recent Messages */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Messages</h4>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading messages...</span>
          </div>
        ) : recentMessages.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentMessages.map((message) => {
              const isSentByCurrentUser = message.sender_id === userId;
              const senderName = message.sender?.display_name || message.sender?.username || 'Unknown';
              
              return (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    isSentByCurrentUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-2 rounded-lg text-sm",
                    isSentByCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between text-xs mt-1 opacity-75">
                      <span>{senderName}</span>
                      <span>{formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">No messages yet</p>
        )}
      </div>

      {/* Reply Input */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            disabled={sending}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim()}
            size="sm"
            className="self-end"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreadQuickReply;