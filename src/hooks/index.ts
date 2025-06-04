// Primary hooks - Use these for new development
export { useAuth } from './useAuth';
export { useData, useDataMutation } from './useData';
export { useAnalytics } from './useAnalytics';
export { useNotifications } from './useNotifications';

// Essential utility hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Admin hooks
export { useSimpleAdmin } from './admin/useSimpleAdmin';

// Feature-specific hooks (keep only essential ones)
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';

// Mobile support
export { useIsMobile } from './use-mobile';

// Service worker
export { useServiceWorkerSetup } from './service-worker/useServiceWorkerSetup';

// Bar crawl hooks
export * from './barCrawl';
