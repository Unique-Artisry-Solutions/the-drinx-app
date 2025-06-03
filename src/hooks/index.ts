// Core consolidated hooks - Use these instead of specialized hooks
export * from './core';

// Legacy hooks - These will be deprecated
export { useSimplifiedAdminData } from './admin/useSimplifiedAdminData';
export { useAdminPage } from './admin/useAdminPage';

// Keep essential specialized hooks
export { useToast } from './use-toast';
export { useRetry } from './useRetry';
export { useNavigationGuard } from './useNavigationGuard';

// Commonly used legacy exports for backward compatibility
export { useUserRecipes } from './useUserRecipes';
export { useSwigCircuits } from './useSwigCircuits';
export { useStreakData } from './useStreakData';

// Re-export admin hooks
export * from './admin';
