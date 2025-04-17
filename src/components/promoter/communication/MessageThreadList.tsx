
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MessageThread } from '@/hooks/promoter/types';

interface MessageThreadListProps {
  conversations: MessageThread[];
  onSelectConversation: (id: string) => void;
}

const MessageThreadList: React.FC<MessageThreadListProps> = ({ 
  conversations,
  onSelectConversation
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground mb-2">No messages found</p>
        <p className="text-sm text-muted-foreground">Messages with venues will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div 
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)} 
          className={`p-3 rounded-lg flex items-start justify-between cursor-pointer border ${
            !conversation.isRead ? 'bg-muted/30 border-muted-foreground/20' : 'bg-card border-border'
          } hover:bg-muted/50 transition-colors`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium ${!conversation.isRead ? 'font-semibold' : ''}`}>
                {conversation.venueName}
              </h4>
              {!conversation.isRead && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">New</Badge>
              )}
              {conversation.eventName && (
                <Badge variant="outline" className="ml-2">{conversation.eventName}</Badge>
              )}
            </div>
            
            <p className={`text-sm line-clamp-1 mt-1 ${!conversation.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {conversation.lastMessage}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
            {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThreadList;
