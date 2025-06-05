
// Shared Components - Phase 5 Cleaned
// Essential shared components and utilities

// Standard layout components
export { default as StandardPageActions } from './StandardPageActions';
export { default as StandardPageContent } from './StandardPageContent';
export { default as StandardPageHeader } from './StandardPageHeader';
export { default as StandardPageLayout } from './StandardPageLayout';

// Enhanced components
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

// Types and utilities
export * from './types';
export * from './utils';
export { useStrictValidation } from '../../hooks/useStrictValidation';
