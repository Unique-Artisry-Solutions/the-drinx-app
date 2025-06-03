
// Core utilities - Use these for all new development
export { cn } from '@/lib/utils';
export { 
  calculateDistance, 
  formatNumber, 
  formatDate, 
  truncateText, 
  randomString 
} from '@/lib/utils';

// Toast utilities - Consolidated approach
export { debouncedToast } from './debouncedToast';
export { toastDeduplication } from './toastDeduplication';

// Environment utilities
export { isPreviewEnvironment } from './environment';

// Deprecated utilities (remove in next phase)
/** @deprecated Use debouncedToast instead */
export { showSuccessToast, showErrorToast } from './toastUtils';

/** @deprecated Use formatDate from @/lib/utils instead */
export { formatDateTime } from './dateUtils';

/** @deprecated Use calculateDistance from @/lib/utils instead */
export { getDistance } from './locationUtils';

/** @deprecated Use randomString from @/lib/utils instead */
export { generateId } from './idUtils';
