
// Core consolidated hooks - Phase 9A standardized exports
export { useData } from './useData';
export { useAuth } from './useAuth';
export { useAnalytics } from './useAnalytics';
export { useNotifications } from './useNotifications';

// Types
export type { 
  DataState, 
  DataActions, 
  UseDataOptions 
} from './useData';

export type { 
  AuthState, 
  AuthActions 
} from './useAuth';

export type { 
  AnalyticsData,
  AnalyticsState, 
  AnalyticsActions 
} from './useAnalytics';

export type { 
  NotificationItem,
  NotificationState, 
  NotificationActions 
} from './useNotifications';

// Re-export user role types for convenience
export type { 
  UserRole, 
  SwitchableUserRole 
} from '@/types/userRole';

export { 
  isSwitchableRole, 
  getRoleDisplayName 
} from '@/types/userRole';
