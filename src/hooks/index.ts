
// Core consolidated hooks - Use these for new development
export * from './core';

// Essential utility hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Legacy compatibility (deprecated - migrate to core hooks)
export { useAuthenticatedUser } from './useAuthenticatedUser';
export { useDevAuthBypass } from './useDevAuthBypass';
export { useDirectNotifications } from './useDirectNotifications';

// Admin legacy hooks (use core useData instead)
export { useSimpleAdmin } from './admin/useSimpleAdmin';
export { useSimplifiedAdminData } from './admin/useSimplifiedAdminData';

// Specific feature hooks (consider migrating to core hooks)
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';
