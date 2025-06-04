
import React, { useEffect, useContext, createContext } from 'react';
import { useAuth } from '@/contexts/auth';
import { NotificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';

interface RealTimeNotificationContextType {
  isConnected: boolean;
}

const RealTimeNotificationContext = createContext<RealTimeNotificationContextType>({
  isConnected: false
});

export const useRealTimeNotifications = () => {
  return useContext(RealTimeNotificationContext);
};

interface RealTimeNotificationProviderProps {
  children: React.ReactNode;
}

export const RealTimeNotificationProvider: React.FC<RealTimeNotificationProviderProps> = ({
  children
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    const unsubscribe = NotificationService.subscribe((notifications) => {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      unreadNotifications.forEach(notification => {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default'
        });
        
        // Mark as read after showing
        NotificationService.markAsRead(notification.id);
      });
    });

    return unsubscribe;
  }, [user, toast]);

  const value = {
    isConnected: !!user
  };

  return (
    <RealTimeNotificationContext.Provider value={value}>
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

export default RealTimeNotificationProvider;
