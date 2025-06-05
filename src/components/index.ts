
// Main Components Index - Phase 5 Cleaned
// Simplified and focused exports only

// Core UI components
export * from './ui';

// Essential layout and navigation
export { default as Layout } from './Layout';
export { default as TopNavigation } from './TopNavigation';

// Primary feature components (direct exports only)
export { default as EstablishmentCard } from './EstablishmentCard';
export { default as CocktailCard } from './CocktailCard';
export { default as EstablishmentList } from './EstablishmentList';
export { default as UserAuth } from './UserAuth';

// Feature modules (barrel exports maintained where needed)
export * from './navigation';
export * from './admin';
export * from './shared';
export * from './notifications';
export * from './auth';
export * from './barCrawl';
export * from './analytics';
export * from './charts';
export * from './rewards';
