
import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import Layout from '@/components/Layout';
import NotificationsLayout from '@/components/notifications/NotificationsLayout';
import NotificationsHeader from './components/NotificationsHeader';
import UnifiedNotificationsList from '@/components/notifications/UnifiedNotificationsList';
import NotificationError from '@/components/notifications/NotificationError';

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, error, markAllAsRead, refetch } = useNotifications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <NotificationsLayout title="Your Notifications">
        <NotificationsHeader 
          unreadCount={unreadCount}
          onMarkAllRead={markAllAsRead}
          onRefresh={refetch}
        />
        
        {error && <NotificationError error={error} />}
        
        <div className="mt-6">
          <UnifiedNotificationsList 
            notifications={notifications}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </NotificationsLayout>
    </Layout>
  );
}
