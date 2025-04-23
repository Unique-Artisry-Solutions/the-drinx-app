
import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import NotificationsList from './components/NotificationsList';
import NotificationsHeader from './components/NotificationsHeader';

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, error, markAllAsRead, refetch } = useNotifications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <NotificationsHeader 
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
        onRefresh={refetch}
      />
      
      <div className="mt-6">
        <NotificationsList 
          notifications={notifications}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
