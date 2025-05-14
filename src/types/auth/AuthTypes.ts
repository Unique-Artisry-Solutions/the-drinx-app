
/**
 * Barrel export file for Authentication related types
 */

export * from './AuthTypes';
export * from './SessionTypes';

// Valid days for promotions
export type ValidDays = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// User segments for targeted promotions
export type UserSegmentType = 'all' | 'new' | 'returning';
