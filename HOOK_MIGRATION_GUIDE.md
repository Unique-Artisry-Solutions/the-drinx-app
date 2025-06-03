
# Hook Consolidation Migration Guide

## Phase 7A: Hook Consolidation Summary

This phase consolidates 400+ hook usages into 4 core hooks, reducing complexity by ~85%.

## Core Hooks (Use These)

### 1. `useData<T>` - Universal Data Management
Replaces: useAdminData, useEstablishmentsData, useCocktailsData, useUserRecipes, etc.

```typescript
import { useData } from '@/hooks/core';

// Replace old specialized hooks
const { state, actions } = useData<Establishment>({
  initialData: [],
  fetchFn: fetchEstablishments,
  createFn: createEstablishment,
  updateFn: updateEstablishment,
  deleteFn: deleteEstablishment,
  itemType: 'establishment'
});
```

### 2. `useAuth` - Authentication & User Management
Replaces: useAuthActions, useProfileData, useRoleSwitch, etc.

```typescript
import { useAuth } from '@/hooks/core';

const { state, actions } = useAuth();
// state: { user, isLoading, isAuthenticated, userType, error }
// actions: { login, logout, signup, resetPassword, updateProfile, switchRole }
```

### 3. `useAnalytics` - Analytics & Tracking
Replaces: useAnalytics, useMobileAnalytics, tracking hooks, etc.

```typescript
import { useAnalytics } from '@/hooks/core';

const { state, actions } = useAnalytics();
// state: { data, isLoading, error, dateRange }
// actions: { fetchData, trackEvent, setDateRange }
```

### 4. `useNotifications` - All Notification Management
Replaces: useNotifications, usePushNotifications, useTestNotification, etc.

```typescript
import { useNotifications } from '@/hooks/core';

const { state, actions } = useNotifications();
// state: { notifications, unreadCount, isLoading, error }
// actions: { markAsRead, markAllAsRead, sendTestNotification, etc. }
```

## Deprecated Hooks (Remove Usage)

### High Priority Removals
- `useNotificationTesting` → Use `useNotifications.actions.sendTestNotification`
- `useNotificationSupport` → Inline logic or use `useNotifications`
- `useNotificationPermission` → Use `useNotifications`
- `useMobileAnalytics` → Use `useAnalytics`
- `useAdminDashboard` → Use `useData` + `useAnalytics`
- `useSimplifiedAdminData` → Use `useData`

### Medium Priority Removals
- All `notifications/testing/*` hooks → Use core `useNotifications`
- Analytics-specific hooks → Use core `useAnalytics`
- Single-use profile hooks → Use core `useAuth`

### Keep These Essential Hooks
- `useToast` - UI feedback system
- `useRetry` - Error handling utility
- `useNavigationGuard` - Route protection

## Migration Steps

1. **Replace data management hooks**: Use `useData<T>` with proper configuration
2. **Consolidate auth hooks**: Switch to core `useAuth`
3. **Merge analytics hooks**: Use core `useAnalytics`
4. **Simplify notifications**: Use core `useNotifications`
5. **Remove testing infrastructure**: Keep only essential test utilities

## Benefits
- 85% reduction in hook complexity
- Consistent patterns across the app
- Easier maintenance and debugging
- Better TypeScript support
- Reduced bundle size
