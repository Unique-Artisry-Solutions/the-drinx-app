
import React from 'react';
import { Notification } from '@/types/NotificationTypes';
import { 
  Bell, AlertCircle, MessageCircle, 
  Glasses, Store, UserCheck 
} from 'lucide-react';

interface NotificationContentProps {
  notification: Notification;
}

const NotificationContent: React.FC<NotificationContentProps> = ({ notification }) => {
  const getNotificationIcon = () => {
    const type = notification.metadata?.type;
    
    switch (type) {
      case 'bar_crawl':
        return <Glasses className="h-5 w-5 text-purple-500" />;
      case 'establishment':
      case 'mocktail_suggestion':
        return <Store className="h-5 w-5 text-blue-500" />;
      case 'venue_message':
      case 'promoter':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'admin':
      case 'moderation':
        return <UserCheck className="h-5 w-5 text-amber-500" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {getNotificationIcon()}
      </div>
      <div>
        <h4 className="font-medium">{notification.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
      </div>
    </div>
  );
};

export default NotificationContent;
