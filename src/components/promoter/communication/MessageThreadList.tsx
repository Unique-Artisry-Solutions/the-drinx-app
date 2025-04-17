
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageThread } from '@/hooks/messages/useMessageSystem';

interface MessageThreadListProps {
  conversations: MessageThread[];
  onSelectConversation: (threadId: string) => void;
}

const MessageThreadList: React.FC<MessageThreadListProps> = ({ 
  conversations, 
  onSelectConversation 
}) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>No messages found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[500px]">
      {conversations.map((conversation) => (
        <div 
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={cn(
            "p-3 rounded-md transition-colors duration-200 cursor-pointer border",
            conversation.isRead 
              ? "bg-white hover:bg-gray-50" 
              : "bg-purple-50 border-purple-200 hover:bg-purple-100"
          )}
        >
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "font-medium",
              !conversation.isRead && "font-semibold text-purple-700"
            )}>
              {conversation.venueName}
              {conversation.eventName && <span className="text-gray-500 text-sm ml-2">({conversation.eventName})</span>}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className={cn(
            "text-sm mt-1 line-clamp-2",
            conversation.isRead ? "text-gray-600" : "text-gray-900"
          )}>
            {conversation.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageThreadList;
