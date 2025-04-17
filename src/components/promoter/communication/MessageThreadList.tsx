
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageThread } from '@/hooks/messages/useMessageSystem';
import { AlertCircle } from 'lucide-react';

interface MessageThreadListProps {
  conversations: MessageThread[];
  onSelectConversation: (threadId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const MessageThreadList: React.FC<MessageThreadListProps> = ({ 
  conversations, 
  onSelectConversation,
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex flex-col gap-3 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-md w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-gray-600 mb-1">{error}</p>
        <p className="text-sm text-gray-500">Please try again later or contact support.</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No messages found</p>
        <p className="text-sm text-gray-400">Start a conversation with a venue from the Contacts tab</p>
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
