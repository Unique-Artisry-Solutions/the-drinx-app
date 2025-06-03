
import React from 'react';
import { Notification } from '@/types/notification';
import NotificationItem from './NotificationItem';
import { AlertCircle } from 'lucide-react';

interface UnifiedNotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  onMarkAsRead?: (id: string) => void;
  enhanced?: boolean;
}

const UnifiedNotificationsList: React.FC<UnifiedNotificationsListProps> = ({
  notifications,
  isLoading,
  error,
  onMarkAsRead,
  enhanced = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading notifications</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No notifications to display</p>
      </div>
    );
  }

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={handleMarkAsRead}
        />
      ))}
    </div>
  );
};

export default UnifiedNotificationsList;
