
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, AlertCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/NotificationTypes';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
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

  const getIcon = () => {
    switch (notification.priority) {
      case 'urgent':
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "p-4 mb-2 border rounded-lg transition-colors",
        getPriorityStyles(),
        isUnread ? 'border-l-4' : ''
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getIcon()}
          </div>
          <div>
            <h4 className={cn("font-medium", isUnread && "font-semibold")}>
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {notification.content}
            </p>
            <div className="text-xs text-gray-400 mt-2">
              {formattedTime}
            </div>
          </div>
        </div>
        {isUnread && (
          <Button 
            size="sm" 
            variant="ghost"
            className="px-2 h-8"
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            <span className="text-xs">Mark read</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
