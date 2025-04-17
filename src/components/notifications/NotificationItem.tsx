
import React from 'react';
import { format } from 'date-fns';
import { Bell, Check } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-600',
    medium: 'bg-green-100 text-green-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600'
  };

  return (
    <div 
      className={`flex p-4 rounded-lg ${
        notification.is_read ? 'bg-white' : 'bg-blue-50'
      } border mb-2`}
    >
      <div className="mr-3">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${priorityColors[notification.priority]}`}>
          <Bell size={18} />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{notification.title}</h4>
        <p className="text-sm text-gray-600">{notification.content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(notification.created_at), 'MMM d, yyyy, h:mm a')}
          {notification.notification_categories && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
              {notification.notification_categories.name}
            </span>
          )}
        </p>
      </div>
      {!notification.is_read && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 text-green-600 hover:text-green-700"
          onClick={() => onMarkAsRead(notification.id)}
        >
          <Check size={16} />
        </Button>
      )}
    </div>
  );
};

export default NotificationItem;
