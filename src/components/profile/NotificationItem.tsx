
import React from 'react';
import { format } from 'date-fns';
import { Bell, Check } from 'lucide-react';
import { UserNotification } from '@/types/VisitTypes';

interface NotificationItemProps {
  notification: UserNotification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const getIcon = () => {
    switch (notification.notification_type) {
      case 'achievement':
        return <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <Bell size={18} />
        </div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bell size={18} />
        </div>;
    }
  };

  return (
    <div className={`flex p-3 rounded-lg ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{notification.title}</h4>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(notification.created_at), 'MMM d, yyyy, h:mm a')}
        </p>
      </div>
      {!notification.is_read && (
        <button 
          onClick={() => onMarkAsRead(notification.id)}
          className="ml-2 p-1 rounded-full bg-white hover:bg-gray-100"
        >
          <Check size={16} className="text-green-600" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
