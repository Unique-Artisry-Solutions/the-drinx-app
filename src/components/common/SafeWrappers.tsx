
/**
 * Safe wrapper components for error-prone scenarios
 */

import React from 'react';
import { Establishment, Event, User } from '@/types/CoreTypes';
import { 
  safeGetEstablishment, 
  safeGetEvent, 
  safeGetUser,
  adaptToEstablishmentCard,
  adaptToEventCard,
  adaptToUserProfile
} from '@/utils/componentSafety';

interface SafeEstablishmentWrapperProps {
  establishment: any;
  children: (safeEstablishment: Establishment) => React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeEstablishmentWrapper: React.FC<SafeEstablishmentWrapperProps> = ({
  establishment,
  children,
  fallback = <div className="text-gray-500">Establishment data unavailable</div>
}) => {
  try {
    const safeEstablishment = safeGetEstablishment(establishment);
    if (!safeEstablishment.id || safeEstablishment.id === 'unknown') {
      return <>{fallback}</>;
    }
    return <>{children(safeEstablishment)}</>;
  } catch (error) {
    console.warn('SafeEstablishmentWrapper error:', error);
    return <>{fallback}</>;
  }
};

interface SafeEventWrapperProps {
  event: any;
  children: (safeEvent: Event) => React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeEventWrapper: React.FC<SafeEventWrapperProps> = ({
  event,
  children,
  fallback = <div className="text-gray-500">Event data unavailable</div>
}) => {
  try {
    const safeEvent = safeGetEvent(event);
    if (!safeEvent.id || safeEvent.id === 'unknown') {
      return <>{fallback}</>;
    }
    return <>{children(safeEvent)}</>;
  } catch (error) {
    console.warn('SafeEventWrapper error:', error);
    return <>{fallback}</>;
  }
};

interface SafeUserWrapperProps {
  user: any;
  children: (safeUser: User) => React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeUserWrapper: React.FC<SafeUserWrapperProps> = ({
  user,
  children,
  fallback = <div className="text-gray-500">User data unavailable</div>
}) => {
  try {
    const safeUser = safeGetUser(user);
    if (!safeUser.id || safeUser.id === 'unknown') {
      return <>{fallback}</>;
    }
    return <>{children(safeUser)}</>;
  } catch (error) {
    console.warn('SafeUserWrapper error:', error);
    return <>{fallback}</>;
  }
};

interface SafeRenderProps<T> {
  data: any;
  validator: (data: any) => boolean;
  children: (validData: T) => React.ReactNode;
  fallback?: React.ReactNode;
  errorMessage?: string;
}

export function SafeRender<T>({
  data,
  validator,
  children,
  fallback = <div className="text-gray-500">Data unavailable</div>,
  errorMessage = 'Invalid data provided'
}: SafeRenderProps<T>) {
  try {
    if (!validator(data)) {
      console.warn(errorMessage, data);
      return <>{fallback}</>;
    }
    return <>{children(data as T)}</>;
  } catch (error) {
    console.warn('SafeRender error:', error);
    return <>{fallback}</>;
  }
}

// Higher-order component for safe property access
export function withSafeProps<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>
) {
  return function SafePropsComponent(props: P) {
    try {
      // Basic validation - ensure props exist and are not null/undefined
      const safeProps = { ...props };
      
      // Convert any null establishment to safe establishment
      if ('establishment' in safeProps && safeProps.establishment) {
        safeProps.establishment = safeGetEstablishment(safeProps.establishment);
      }
      
      // Convert any null event to safe event
      if ('event' in safeProps && safeProps.event) {
        safeProps.event = safeGetEvent(safeProps.event);
      }
      
      // Convert any null user to safe user
      if ('user' in safeProps && safeProps.user) {
        safeProps.user = safeGetUser(safeProps.user);
      }
      
      return <WrappedComponent {...safeProps} />;
    } catch (error) {
      console.warn('withSafeProps error:', error);
      return <div className="text-red-500">Component error occurred</div>;
    }
  };
}
