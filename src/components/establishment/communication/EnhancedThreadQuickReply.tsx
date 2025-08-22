import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/hooks/messages/types';
import { useMessages } from '@/hooks/messages/useMessages';
import { useDraftPersistence } from '@/hooks/messages/useDraftPersistence';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Loader2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MessageInput from '@/components/promoter/communication/messages/MessageInput';
import MessageList from '@/components/promoter/communication/messages/MessageList';

interface EnhancedThreadQuickReplyProps {
  threadId: string;
  onSendMessage: (threadId: string, content: string) => Promise<void>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  userId?: string;
}

const EnhancedThreadQuickReply: React.FC<EnhancedThreadQuickReplyProps> = ({
  threadId,
  onSendMessage,
  isExpanded,
  onToggleExpand,
  onClose,
  userId
}) => {
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { fetchMessages } = useMessages('establishment');

  const fetchRecentMessages = useCallback(async () => {
    if (!threadId) return;
    
    setLoading(true);
    try {
      const messages = await fetchMessages(threadId);
      // Show last 5 messages
      setRecentMessages(messages.slice(-5));
    } catch (error) {
      console.error('Error fetching recent messages:', error);
    } finally {
      setLoading(false);
    }
  }, [threadId, fetchMessages]);

  // Fetch recent messages when expanded
  useEffect(() => {
    if (isExpanded) {
      fetchRecentMessages();
    }
  }, [isExpanded, fetchRecentMessages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExpanded && e.key === 'Escape') {
        onClose();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus container for accessibility
      containerRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, onClose]);

  const handleSendReply = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(threadId, content.trim());
      await fetchRecentMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  }, [threadId, onSendMessage, fetchRecentMessages, sending]);

  if (!isExpanded) return null;

  return (
    <Card 
      ref={containerRef}
      className="mt-2 border-l-4 border-l-primary shadow-lg"
      tabIndex={-1}
      role="dialog"
      aria-label="Quick reply conversation"
      aria-modal="false"
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with close button */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Quick Reply</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close quick reply"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Recent Messages */}
          <div 
            className="max-h-64 overflow-y-auto"
            role="log"
            aria-label="Recent messages"
          >
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading recent messages...</span>
              </div>
            ) : recentMessages.length > 0 ? (
              <MessageList 
                messages={recentMessages} 
                userId={userId} 
                showDeliveryStatus={true}
              />
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No recent messages
              </div>
            )}
          </div>
          
          {/* Reply Input */}
          <div className="border-t pt-4">
            <MessageInput
              onSendMessage={handleSendReply}
              disabled={sending}
              threadId={threadId}
              onEscape={onClose}
              placeholder="Type your reply..."
              autoFocus={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedThreadQuickReply;