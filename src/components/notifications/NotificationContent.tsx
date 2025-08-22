
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Notification } from '@/types/notification';
import { 
  Bell, AlertCircle, MessageCircle, 
  Glasses, Store, UserCheck 
} from 'lucide-react';

interface NotificationContentProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationContent: React.FC<NotificationContentProps> = ({ notification, onClick }) => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  
  const handleClick = () => {
    // Handle navigation for message-related notifications
    const isMessageNotification = 
      notification.metadata?.type === 'promoter_message' || 
      notification.metadata?.type === 'venue_message' ||
      notification.metadata?.thread_id ||
      notification.title?.includes('Message from');
      
    if (isMessageNotification) {
      // Extract thread ID if available
      const threadId = notification.metadata?.thread_id;
      
      // Navigate based on user type and thread availability
      if (threadId) {
        // Direct navigation to specific thread
        switch (userType) {
          case 'establishment':
            navigate(`/establishment/messages/${threadId}`);
            break;
          case 'promoter':
            navigate(`/promoter/messages/${threadId}`);
            break;
          case 'admin':
            navigate('/admin/all-actions');
            break;
          default:
            navigate('/individual/all-actions');
        }
      } else {
        // Fallback to all-actions page with embedded messaging
        switch (userType) {
          case 'establishment':
            navigate('/establishment/all-actions');
            break;
          case 'promoter':
            navigate('/promoter/all-actions');
            break;
          case 'admin':
            navigate('/admin/all-actions');
            break;
          default:
            navigate('/individual/all-actions');
        }
      }
    }
    
    // Call the optional onClick prop
    if (onClick) {
      onClick();
    }
  };
  
  const isClickable = notification.metadata?.type === 'promoter_message' || 
                     notification.metadata?.type === 'venue_message' ||
                     notification.metadata?.thread_id ||
                     notification.title?.includes('Message from');
  const getNotificationIcon = () => {
    const type = notification.metadata?.type;
    
    switch (type) {
      case 'bar_crawl':
        return <Glasses className="h-5 w-5 text-purple-500" aria-hidden="true" />;
      case 'establishment':
      case 'mocktail_suggestion':
        return <Store className="h-5 w-5 text-blue-500" aria-hidden="true" />;
      case 'venue_message':
      case 'promoter':
        return <MessageCircle className="h-5 w-5 text-green-500" aria-hidden="true" />;
      case 'admin':
      case 'moderation':
        return <UserCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />;
      case 'system':
        return <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    }
  };

  const getTypeDescription = () => {
    const type = notification.metadata?.type;
    switch (type) {
      case 'bar_crawl':
        return 'Bar Crawl notification';
      case 'establishment':
        return 'Establishment update';
      case 'mocktail_suggestion':
        return 'Mocktail suggestion';
      case 'venue_message':
        return 'Message from venue';
      case 'promoter':
        return 'Promoter notification';
      case 'admin':
        return 'Admin notification';
      case 'moderation':
        return 'Moderation alert';
      case 'system':
        return 'System notification';
      default:
        return 'General notification';
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 ${isClickable ? 'cursor-pointer hover:bg-gray-50 p-2 rounded -m-2' : ''}`}
      onClick={isClickable ? handleClick : undefined}
    >
      <div className="mt-0.5" aria-hidden="true">
        {getNotificationIcon()}
      </div>
      <div>
        <h4 
          id={`notification-${notification.id}-title`}
          className="font-medium"
        >
          {notification.title}
        </h4>
        <p 
          id={`notification-${notification.id}-content`}
          className="text-sm text-gray-600 mt-1"
        >
          <span className="sr-only">{getTypeDescription()}:</span>
          {notification.content}
        </p>
        {isClickable && (
          <p className="text-xs text-blue-600 mt-1">Click to view message</p>
        )}
      </div>
    </div>
  );
};

export default NotificationContent;
