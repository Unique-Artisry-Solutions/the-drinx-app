/**
 * Main Types Index - Exports from Master Type System
 * This is now the single entry point for all type definitions
 */

// Export the master type system first (these take priority)
export * from './master/index';

// Re-export specific domains for organization, avoiding conflicts
export * from './auth';
export * from './rewards';

// Navigation types - be selective to avoid conflicts
export type { NavigationState as EffectiveAuthState } from './navigation';
export type { LinkProps } from './navigation';

// Notification types - be selective to avoid conflicts  
export type { NotificationOptions, NotificationType } from './notification';

// Legacy compatibility - gradually phase these out
export * from './ProfileTypes';
export * from './EventTypes';
export * from './ExploreTypes';

// Keep specialized types that don't fit in master system yet
export * from './TicketTypes';
export * from './PaymentTypes';
export * from './SubscriptionTypes';
export * from './AudienceTypes';
export * from './CampaignSegmentTypes';
