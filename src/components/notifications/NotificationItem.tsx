
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/NotificationTypes';
import NotificationContent from './NotificationContent';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const isUnread = !notification.is_read;
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-red-200 bg-red-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'medium':
        return isUnread ? 'border-blue-200 bg-blue-50' : '';
      default:
        return isUnread ? 'border-gray-200 bg-gray-50' : '';
    }
  };

  return (
    <article 
      className={cn(
        "p-4 mb-2 border rounded-lg transition-colors",
        getPriorityStyles(),
        isUnread ? 'border-l-4' : ''
      )}
      role="article"
      aria-label={`${notification.title} - ${isUnread ? 'Unread' : 'Read'} notification`}
    >
      <div className="flex justify-between items-start">
        <NotificationContent notification={notification} />
        <div className="flex flex-col items-end gap-2">
          <time 
            className="text-xs text-gray-400"
            dateTime={notification.created_at}
            aria-label={`Sent ${formattedTime}`}
          >
            {formattedTime}
          </time>
          {isUnread && (
            <Button 
              size="sm" 
              variant="ghost"
              className="px-2 h-8"
              onClick={() => onMarkAsRead(notification.id)}
              aria-label="Mark as read"
            >
              <Check className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="text-xs">Mark read</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default NotificationItem;
