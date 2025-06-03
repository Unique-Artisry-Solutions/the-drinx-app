
import { useData as useAdminData } from '../core/useData';
import { useAuth as useAdminAuth } from '../core/useAuth';
import { useAnalytics as useAdminAnalytics } from '../core/useAnalytics';

export { useAdminNavigation } from './useAdminNavigation';
export { useAdminActions } from './useAdminActions';
export { useAdminCodeReduction } from './useAdminCodeReduction';
export { useAdminTabs } from './useAdminTabs';

export type {
  AdminDataState,
  AdminDataActions
} from './useAdminData';

export type {
  NavigationConfig
} from './useAdminNavigation';

export type {
  AdminActionsConfig
} from './useAdminActions';

export type {
  UseAdminTabsState,
  UseAdminTabsActions
} from '@/types/admin/TabTypes';

// Add simplified admin hook
export { useSimpleAdmin } from './useSimpleAdmin';
export type { SimpleAdminState, SimpleAdminActions } from './useSimpleAdmin';

// Add simplified admin hook
export { useSimplifiedAdminData } from './useSimplifiedAdminData';
export type { SimplifiedAdminState, SimplifiedAdminActions } from './useSimplifiedAdminData';
