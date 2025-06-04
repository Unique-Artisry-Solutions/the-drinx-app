
/**
 * Barrel export file for Notification related types
 */

export * from './NotificationTypes';
export * from './ToastTypes';
export * from './PushNotificationTypes';
export * from './TestingTypes';

// Re-export the main notification interface from the root
export type { Notification, NotificationType, NotificationOptions, NotificationFormData, NotificationCategory, NotificationPreferences, NotificationMetadata } from '../notification';

// Create a type alias for backward compatibility
export type { Notification as NotificationInterface } from '../notification';

import type { ActionConfig } from '@/hooks/use-toast';

// Re-export ActionConfig
export type { ActionConfig };
