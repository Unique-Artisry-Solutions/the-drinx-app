
// Main Components Index - Phase 2 Consolidated
// This file provides organized access to all component modules

// Core layout and navigation
export * from './navigation';
export * from './layout';
export * from './cards';

// Feature Modules (Barrel Exports)
export * from './barCrawl';
export * from './auth';
export * from './notifications';
export * from './analytics';
export * from './forms';
export * from './common';
export * from './development';
export * from './map';
export * from './pages';

// Admin modules
export * from './admin';
export * from './shared';

// Charts (legacy compatibility)
export * from './charts';

// UI components (from shadcn)
export * from './ui';

// Specialized modules
export * from './animations';
export * from './rewards';
export * from './promoter';
export * from './pricing';

// Direct exports for commonly used components
export { default as Layout } from './Layout';
export { default as TopNavigation } from './navigation/TopNavigation';
export { default as EstablishmentCard } from './EstablishmentCard';
export { default as CocktailCard } from './CocktailCard';
export { default as EstablishmentList } from './EstablishmentList';
