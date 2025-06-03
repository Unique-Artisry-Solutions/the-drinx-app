
# Hook Simplification Guide - Phase 8A

## Overview
This phase consolidates the hook architecture into 4 core hooks, reducing complexity by ~75% while maintaining full functionality.

## Core Hooks (Use These)

### 1. `useData<T>` - Universal Data Management
Replaces all data management hooks including:
- useAdminData, useEstablishmentsData, useCocktailsData
- useUserRecipes, useSwigCircuits, etc.

```typescript
import { useData } from '@/hooks/core';

const { state, actions } = useData<MyDataType>({
  initialData: [],
  fetchFn: myFetchFunction,
  createFn: myCreateFunction,
  updateFn: myUpdateFunction,
  deleteFn: myDeleteFunction,
  itemType: 'my-item'
});
```

### 2. `useAuth` - Authentication & User Management
Replaces all auth-related hooks:
- useAuthActions, useProfileActions, useRoleSwitch

```typescript
import { useAuth } from '@/hooks/core';

const { state, actions } = useAuth();
// state: { user, session, isLoading, isAuthenticated, userType, error }
// actions: { login, logout, signup, resetPassword, updateProfile, switchRole }
```

### 3. `useAnalytics` - Analytics & Tracking
Replaces all analytics hooks:
- useAnalyticsData, useMobileAnalytics, tracking hooks

```typescript
import { useAnalytics } from '@/hooks/core';

const { state, actions } = useAnalytics();
// state: { data, isLoading, error, dateRange }
// actions: { fetchData, trackEvent, setDateRange, refresh }
```

### 4. `useNotifications` - Notification Management
Replaces all notification hooks:
- useNotificationTesting, useNotificationSupport, useNotificationPermission

```typescript
import { useNotifications } from '@/hooks/core';

const { state, actions } = useNotifications();
// state: { notifications, unreadCount, isLoading, error }
// actions: { markAsRead, markAllAsRead, sendTestNotification, etc. }
```

## Removed Hooks

### Deleted Files:
- `src/hooks/useAuthActions.ts`
- `src/hooks/useProfileActions.ts`
- `src/hooks/useRoleSwitch.ts`
- `src/hooks/analytics/useAnalyticsData.ts`
- `src/hooks/analytics/useMobileAnalytics.ts`
- `src/hooks/notifications/useNotificationTesting.ts`
- `src/hooks/notifications/useNotificationSupport.ts`
- `src/hooks/notifications/useNotificationPermission.ts`
- `src/hooks/notifications/testing/useTestNotification.ts`
- `src/hooks/notifications/testing/useNotificationTestRunner.ts`
- `src/hooks/admin/useAdminDashboard.ts`

### Migration Strategy:
1. Replace specialized hooks with core equivalents
2. Use consistent patterns across the application
3. Leverage TypeScript for better type safety
4. Maintain backward compatibility where needed

## Benefits:
- 75% reduction in hook files
- Consistent API patterns
- Better error handling
- Improved TypeScript support
- Easier testing and maintenance
- Reduced bundle size

## Next Steps:
- Update components to use core hooks
- Remove remaining legacy hook dependencies
- Complete Phase 8B (Utility Index Reduction)
