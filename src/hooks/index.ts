// Core consolidated hooks - Use these for new development
export * from './core';

// Essential utility hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Admin hooks (use core useData instead for new development)
export { useSimpleAdmin } from './admin/useSimpleAdmin';

// Specific feature hooks (consider migrating to core hooks)
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';
export { useAuthenticatedUser } from './useAuthenticatedUser';
export { useDevAuthBypass } from './useDevAuthBypass';

// Direct notifications hook
export { useDirectNotifications } from './useDirectNotifications';

// Keep legacy useNotifications for backward compatibility
export { useNotifications } from './useNotifications';
