/**
 * Main Types Index - Exports from Master Type System
 * This is now the single entry point for all type definitions
 */

// Export the master type system
export * from './master/registry';

// Re-export specific domains for organization
export * from './auth';
export * from './navigation';
export * from './notification';
export * from './rewards';

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
