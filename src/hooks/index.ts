
// Primary hooks - Specific imports only to avoid circular dependencies
export { useAuth } from './useAuth';
export { useData, useDataMutation } from './useData';
export { useAnalytics } from './useAnalytics';
export { useNotifications } from './useNotifications';

// Compatibility bridges - specific imports
export { useDevAuthBypass } from './useDevAuthBypass';
export { useAuthenticatedUser } from './useAuthenticatedUser';
export { useAuthLoadingStates } from './useAuthLoadingStates';
export { useDirectNotifications } from './useDirectNotifications';

// Essential utility hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Admin hooks - specific import
export { useSimpleAdmin } from './admin/useSimpleAdmin';

// Feature-specific hooks
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';

// Mobile support
export { useIsMobile } from './use-mobile';

// Service worker
export { useServiceWorkerSetup } from './service-worker/useServiceWorkerSetup';

// Bar crawl hooks - specific imports to avoid circular references
export { useBarCrawlParticipation } from './barCrawl/useBarCrawlParticipation';
export { useBarCrawlStatus } from './barCrawl/useBarCrawlStatus';
export { useBarCrawlJoin } from './barCrawl/useBarCrawlJoin';
export { useBarCrawlLeave } from './barCrawl/useBarCrawlLeave';
