
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import { Notification } from '@/types/NotificationTypes';
import { Skeleton } from '@/components/ui/skeleton';

interface EnhancedNotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  onMarkAsRead: (id: string) => void;
}

const EnhancedNotificationsList = ({
  notifications,
  isLoading,
  error,
  onMarkAsRead
}: EnhancedNotificationsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading notifications">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div 
        role="alert" 
        className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg"
      >
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div 
        className="text-center py-8 text-gray-500"
        role="status"
        aria-label="No notifications"
      >
        <p>No notifications to display</p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-4" 
      role="log" 
      aria-label="Notifications list"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedNotificationsList;
