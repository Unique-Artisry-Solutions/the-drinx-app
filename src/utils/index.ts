
// Utilities Index - Phase 9E Consolidation
// Centralized access to all utility functions and helpers

// Core utilities
export * from './constants';
export * from './validators';

// Type utilities
export * from './types';

// Helper utilities (specific imports to avoid conflicts)
export { 
  generateId, 
  debounce, 
  truncateText 
} from './helpers';

// Formatter utilities (aliased to avoid conflicts)
export { 
  formatCurrency as utilsFormatCurrency,
  formatDate as utilsFormatDate
} from './formatters';

// Shared utilities
export * from '../components/shared/utils';
