
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

// Define interfaces for props that might contain these properties
interface PropsWithEstablishment {
  establishment?: any;
}

interface PropsWithEvent {
  event?: any;
}

interface PropsWithUser {
  user?: any;
}

// Higher-order component for safe property access with proper type constraints
export function withSafeProps<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>
) {
  return function SafePropsComponent(props: P) {
    try {
      // Basic validation - ensure props exist and are not null/undefined
      const safeProps = { ...props };
      
      // Convert any establishment to safe establishment if the prop exists
      if ('establishment' in safeProps && (safeProps as PropsWithEstablishment).establishment) {
        (safeProps as PropsWithEstablishment).establishment = safeGetEstablishment(
          (safeProps as PropsWithEstablishment).establishment
        );
      }
      
      // Convert any event to safe event if the prop exists
      if ('event' in safeProps && (safeProps as PropsWithEvent).event) {
        (safeProps as PropsWithEvent).event = safeGetEvent(
          (safeProps as PropsWithEvent).event
        );
      }
      
      // Convert any user to safe user if the prop exists
      if ('user' in safeProps && (safeProps as PropsWithUser).user) {
        (safeProps as PropsWithUser).user = safeGetUser(
          (safeProps as PropsWithUser).user
        );
      }
      
      return <WrappedComponent {...safeProps} />;
    } catch (error) {
      console.warn('withSafeProps error:', error);
      return <div className="text-red-500">Component error occurred</div>;
    }
  };
}
