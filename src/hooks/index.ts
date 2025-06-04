// Core consolidated hooks - Primary exports for all development
export { useAuth } from './useAuth';
export { useAnalytics } from './useAnalytics';
export { useData, useDataMutation } from './useData';
export { useNotifications } from './useNotifications';

// Essential utility hooks
export { useToast } from './use-toast';
export { useIsMobile } from './use-mobile';

// Keep only these specific feature hooks that don't have duplicates
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';
export { useDebouncedToast } from './useDebouncedToast';

// Legacy hooks (mark for future removal)
export { useRetry } from './useRetry';
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';

// Types
export type { NotificationItem } from './useNotifications';
