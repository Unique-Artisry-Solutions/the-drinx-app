
// Core utilities - Phase 9A standardized exports
export { cn } from '@/lib/utils';
export { 
  calculateDistance, 
  formatNumber, 
  formatDate, 
  truncateText, 
  randomString 
} from '@/utils/consolidated';

// Toast utilities - Consolidated approach
export { debouncedToast } from './debouncedToast';
export { toastDeduplication } from './toastDeduplication';

// Environment utilities
export { isPreviewEnvironment } from './environment';

// Location utilities (legacy support)
export { calculateDistance as getDistance, formatDistance } from './locationUtils';

// Consolidated utilities - Primary exports for new development
export * from './consolidated';

// Streamlined utilities - Alternative namespace API
export { utilities } from './streamlined';
