
import React from 'react';
import { Beaker, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface MocktailSuggestionNotification {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read_at?: string;
  suggestion_id: string;
  notification_type: 'new_suggestion' | 'suggestion_feedback';
}

interface MocktailSuggestionNotificationProps {
  notification: MocktailSuggestionNotification;
  onMarkAsRead: (id: string) => void;
  onViewSuggestion: (id: string) => void;
}

const MocktailSuggestionNotification: React.FC<MocktailSuggestionNotificationProps> = ({
  notification,
  onMarkAsRead,
  onViewSuggestion
}) => {
  const isRead = !!notification.read_at;
  const createdTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });
  
  return (
    <div className={`p-4 mb-2 rounded-md border ${isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex items-start">
        <div className={`flex items-center justify-center rounded-full w-10 h-10 mr-3 ${isRead ? 'bg-gray-100' : 'bg-blue-100'}`}>
          <Beaker className={`h-5 w-5 ${isRead ? 'text-gray-500' : 'text-blue-600'}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{notification.title}</h4>
            {!isRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-1"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{createdTime}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewSuggestion(notification.suggestion_id)}
              className="text-xs h-7"
            >
              {notification.notification_type === 'new_suggestion' ? 'View Suggestion' : 'View Feedback'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MocktailSuggestionNotification;
