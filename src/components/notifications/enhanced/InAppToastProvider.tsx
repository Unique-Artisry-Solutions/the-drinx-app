import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedNotifications } from '@/hooks/realtime/useUnifiedNotifications';
import { Notification } from '@/types/notification';
import { mapNotificationTypeToToastVariant } from '@/types/notification/ToastTypes';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface InAppToastContextType {
  showNotificationToast: (notification: Notification) => void;
  dismissToast: (toastId: string) => void;
}

const InAppToastContext = createContext<InAppToastContextType | undefined>(undefined);

export const useInAppToast = () => {
  const context = useContext(InAppToastContext);
  if (!context) {
    throw new Error('useInAppToast must be used within InAppToastProvider');
  }
  return context;
};

interface InAppToastProviderProps {
  children: React.ReactNode;
  enableRealTimeToasts?: boolean;
  maxConcurrentToasts?: number;
}

export const InAppToastProvider: React.FC<InAppToastProviderProps> = ({
  children,
  enableRealTimeToasts = true,
  maxConcurrentToasts = 3
}) => {
  const { toast, dismiss } = useToast();
  const { notifications } = useUnifiedNotifications();
  const displayedToasts = useRef<Set<string>>(new Set());
  const activeToasts = useRef<Map<string, string>>(new Map()); // notification id -> toast id

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getDurationByPriority = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return Infinity; // Manual dismiss only
      case 'high':
        return 8000;
      case 'medium':
        return 5000;
      case 'low':
        return 3000;
      default:
        return 5000;
    }
  };

  const showNotificationToast = (notification: Notification) => {
    // Prevent duplicate toasts
    if (displayedToasts.current.has(notification.id)) {
      return;
    }

    // Limit concurrent toasts
    if (activeToasts.current.size >= maxConcurrentToasts) {
      // Remove oldest toast to make room
      const oldestToastId = Array.from(activeToasts.current.values())[0];
      dismiss(oldestToastId);
    }

    const variant = mapNotificationTypeToToastVariant(notification.metadata?.type as any);
    const duration = getDurationByPriority(notification.priority || 'medium');
    const icon = getNotificationIcon(notification.metadata?.type || 'info');

    const { id: toastId } = toast({
      title: notification.title,
      description: notification.content,
      variant,
      duration: duration === Infinity ? undefined : duration,
      action: duration === Infinity ? {
        label: "Dismiss",
        onClick: () => dismiss(toastId),
        altText: "Dismiss notification"
      } : undefined,
      priority: notification.priority as any,
    });

    // Track displayed toasts
    displayedToasts.current.add(notification.id);
    activeToasts.current.set(notification.id, toastId);

    // Clean up tracking after toast duration
    if (duration !== Infinity) {
      setTimeout(() => {
        displayedToasts.current.delete(notification.id);
        activeToasts.current.delete(notification.id);
      }, duration + 1000);
    }
  };

  const dismissToast = (toastId: string) => {
    dismiss(toastId);
    // Clean up tracking
    for (const [notificationId, tId] of activeToasts.current.entries()) {
      if (tId === toastId) {
        displayedToasts.current.delete(notificationId);
        activeToasts.current.delete(notificationId);
        break;
      }
    }
  };

  // Handle real-time notifications
  useEffect(() => {
    if (!enableRealTimeToasts || !notifications) return;

    const unreadNotifications = notifications.filter(n => !n.is_read);
    const recentNotifications = unreadNotifications.filter(n => {
      const notificationTime = new Date(n.created_at).getTime();
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return notificationTime > fiveMinutesAgo;
    });

    recentNotifications.forEach(notification => {
      showNotificationToast(notification);
    });
  }, [notifications, enableRealTimeToasts]);

  const contextValue: InAppToastContextType = {
    showNotificationToast,
    dismissToast,
  };

  return (
    <InAppToastContext.Provider value={contextValue}>
      {children}
    </InAppToastContext.Provider>
  );
};