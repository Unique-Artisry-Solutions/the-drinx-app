import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageThread } from '@/hooks/messages/types';
import { useMessages } from '@/hooks/messages/useMessages';
import { useEnhancedThreadSubscription } from '@/hooks/messages/useEnhancedThreadSubscription';
import { AlertCircle, ChevronDown, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThreadQuickReply from './ThreadQuickReply';

interface EnhancedMessageThreadListProps {
  conversations: MessageThread[];
  onSelectConversation: (threadId: string) => void;
  onSendMessage: (threadId: string, content: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  userId?: string;
}

const EnhancedMessageThreadList: React.FC<EnhancedMessageThreadListProps> = ({ 
  conversations, 
  onSelectConversation,
  onSendMessage,
  isLoading = false,
  error = null,
  userId
}) => {
  const navigate = useNavigate();
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const { fetchMessages } = useMessages('establishment');
  
  // Get the currently expanded thread (only one can be expanded at a time)
  const expandedThreadId = Array.from(expandedThreads)[0] || null;
  
  // Set up enhanced real-time subscription for the expanded thread
  const { messageStatuses } = useEnhancedThreadSubscription(expandedThreadId, () => {
    // Re-fetch conversations when new messages arrive
    window.location.reload(); // Simple refresh for now - could be optimized
  }, userId);

  const handleToggleExpand = useCallback((threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  }, []);

  const handleSendReply = useCallback(async (threadId: string, content: string) => {
    await onSendMessage(threadId, content);
  }, [onSendMessage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex flex-col gap-3 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <p className="text-muted-foreground mb-1">{error}</p>
        <p className="text-sm text-muted-foreground">Please try again later or contact support.</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground mb-2">No messages found</p>
        <p className="text-sm text-muted-foreground">New messages from promoters will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[600px]">
      {conversations.map((conversation) => {
        const isExpanded = expandedThreads.has(conversation.id);
        
        return (
          <div 
            key={conversation.id}
            className={cn(
              "border rounded-lg transition-all duration-200",
              conversation.isRead 
                ? "bg-card hover:bg-accent/50" 
                : "bg-primary/5 border-primary/20 hover:bg-primary/10"
            )}
          >
            {/* Thread Header */}
            <div className="p-4 cursor-pointer" onClick={() => onSelectConversation(conversation.id)}>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn(
                      "font-medium truncate",
                      !conversation.isRead && "font-semibold text-primary"
                    )}>
                      {conversation.venueName}
                    </h3>
                    {!conversation.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm mt-1 line-clamp-2",
                    conversation.isRead ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {conversation.lastMessage}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleToggleExpand(conversation.id, e)}
                  className="flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Hide Reply
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      Quick Reply
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/establishment/messages/${conversation.id}`);
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  Full Conversation
                </Button>
              </div>
            </div>

            {/* Expanded Reply Section */}
            {isExpanded && (
              <div className="border-t bg-muted/30">
                <ThreadQuickReply
                  threadId={conversation.id}
                  userId={userId}
                  onSendMessage={handleSendReply}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EnhancedMessageThreadList;