
// Consolidated Hooks Index - Phase 9C
// Provides a single entry point for commonly used hooks

// Core hooks (primary exports)
export { 
  useData, 
  useAuth, 
  useAnalytics, 
  useNotifications 
} from './core';

// Essential utility hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Admin hooks (simplified)
export { useSimpleAdmin } from './admin/useSimpleAdmin';

// Feature-specific hooks (commonly used)
export { useAuthenticatedUser } from './useAuthenticatedUser';
export { useDirectNotifications } from './useDirectNotifications';

// Mobile support
export { useIsMobile } from './use-mobile';

// Types
export type { 
  DataState, 
  DataActions,
  AuthState, 
  AuthActions,
  NotificationState, 
  NotificationActions 
} from './core';
