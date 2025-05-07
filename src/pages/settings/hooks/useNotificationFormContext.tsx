
import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { NotificationFormData } from '@/types/notification';

// Context for notification preferences form
export type NotificationFormContextType = UseFormReturn<NotificationFormData>;

const NotificationFormContext = createContext<NotificationFormContextType | null>(null);

export const NotificationFormProvider: React.FC<{
  children: React.ReactNode;
  value: NotificationFormContextType;
}> = ({ children, value }) => {
  return (
    <NotificationFormContext.Provider value={value}>
      {children}
    </NotificationFormContext.Provider>
  );
};

export const useNotificationFormContext = () => {
  const context = useContext(NotificationFormContext);
  if (!context) {
    throw new Error('useNotificationFormContext must be used within a NotificationFormProvider');
  }
  return context;
};
