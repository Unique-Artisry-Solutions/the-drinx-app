
// Admin Components Module - Phase 5 Cleaned
// Focused exports without redundancy

// Layout and structure
export * from './layout';

// Core admin functionality
export * from './tables';
export * from './systemBreakdown';
export * from './systemConfiguration';

// Specialized modules
export * from './contentFlags';
export * from './photoModeration';
export * from './rewards';
export * from './monitoring';

// Analytics and charts
export { default as AnalyticsService } from './analytics/AnalyticsService';
export * from './charts';

// Database and testing
export { default as DatabaseHealthDashboard } from './database/DatabaseHealthDashboard';
export * from './testing';
