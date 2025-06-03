// Core consolidated hooks - Use these instead of specialized hooks
export * from './core';

// Legacy hooks - These are deprecated but maintained for backward compatibility
export { useSimplifiedAdminData } from './admin/useSimplifiedAdminData';
export { useDirectNotifications } from './useDirectNotifications';

// Keep essential specialized hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';
export { useFeatureAccess } from './useFeatureAccess';

// Commonly used legacy exports for backward compatibility
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';

// Re-export admin hooks
export * from './admin';
