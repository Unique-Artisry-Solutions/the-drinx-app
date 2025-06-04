
// Shared Components - Phase 9E Enhanced
// Export both legacy and enhanced components

// Legacy components (maintained for backward compatibility)
export { default as StandardPageActions } from './StandardPageActions';
export { default as StandardPageContent } from './StandardPageContent';
export { default as StandardPageHeader } from './StandardPageHeader';
export { default as StandardPageLayout } from './StandardPageLayout';

// Enhanced components (Phase 9E)
export {
  EnhancedLoadingSpinner,
  EnhancedErrorDisplay,
  EnhancedActionsBar,
  EnhancedContainer,
  type EnhancedLoadingSpinnerProps,
  type EnhancedErrorDisplayProps,
  type EnhancedActionsBarProps,
  type EnhancedContainerProps
} from './EnhancedStandardComponents';

// Types
export * from './types';
export * from '../types/shared/StandardTypes';

// Utilities
export * from './utils';

// Hooks
export { useStrictValidation } from '../../hooks/useStrictValidation';
