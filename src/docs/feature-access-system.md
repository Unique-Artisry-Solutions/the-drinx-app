# Feature Access System Documentation

This document provides detailed information about the feature access system implementation in our application.

## Overview

The feature access system allows the application to control which features are available to different users based on their subscription tier, role, or other criteria. This enables us to implement feature gating, A/B testing, and progressive rollouts.

## Key Components

### 1. Feature Registry (`src/lib/features/registry.ts`)

The feature registry is the central source of truth for all features in the application. It defines:

- **Feature IDs**: Unique identifiers for each feature (e.g., `FEATURE_ADVANCED_ANALYTICS`)
- **Feature metadata**: Name, description, default status, category, etc.
- **Tier mappings**: Which subscription tiers have access to which features
- **Category groupings**: Features organized by functional category

### 2. Feature API (`src/lib/features/api.ts`)

The API layer handles communication with the Supabase backend to:

- Check if a user has access to a specific feature
- Track feature usage events
- Manage feature flags and segments
- Associate features with subscription tiers

### 3. Feature Context (`src/contexts/FeatureContext.tsx`)

The React context provides feature access information throughout the application:

- Access status for features
- Loading states
- Tracking functions

### 4. Feature Gate Component (`src/components/FeatureGate.tsx`)

The `FeatureGate` component conditionally renders content based on feature access:

```jsx
<FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
  <AdvancedAnalytics />
</FeatureGate>
```

It also supports fallback content and upgrade prompts when access is denied.

### 5. Feature Toggle Hook (`src/components/FeatureGate.tsx`)

The `useFeatureToggle` hook provides a programmatic way to conditionally execute code based on feature access:

```jsx
const { whenEnabled } = useFeatureToggle(FEATURES.BULK_MESSAGING);

whenEnabled(() => {
  // This code only runs if the user has access to bulk messaging
  sendBulkMessages();
}, () => {
  // Optional fallback when access is denied
  showUpgradeMessage();
});
```

## Database Structure

The feature access system relies on several database tables:

1. **feature_flags**: Stores feature definitions and global state
2. **subscription_features**: Maps features to subscription tiers
3. **feature_metrics**: Tracks feature usage events
4. **feature_segments**: Defines user segments for targeted feature access

## Performance Optimization

The system includes several optimization techniques:

1. **Client-side caching**: Feature access results are cached to reduce API calls
2. **Batch loading**: Common features are loaded in batches
3. **Admin fast path**: Administrators automatically have access to all features
4. **Default values**: Features have sensible defaults when access hasn't been checked yet

## Security Considerations

1. Access checks are performed both on the client and server side
2. Row Level Security (RLS) policies protect feature configuration data
3. Audit logs track changes to protected feature settings

## Adding a New Feature

To add a new feature to the system:

1. Add the feature ID to the `FEATURES` object in `registry.ts`
2. Add feature metadata to the `featureRegistry` in `registry.ts`
3. Add the feature to the appropriate tier mappings in `featuresByTier`
4. Wrap the feature implementation in a `FeatureGate` component

Example:
```typescript
// 1. Add to FEATURES
export const FEATURES = {
  // ... existing features
  NEW_FEATURE: 'FEATURE_NEW_FEATURE',
};

// 2. Add metadata
export const featureRegistry: Record<FeatureId, Feature> = {
  // ... existing features
  [FEATURES.NEW_FEATURE]: {
    id: FEATURES.NEW_FEATURE,
    name: 'New Feature',
    description: 'Description of the new feature',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'core'
  },
};

// 3. Add to tiers
export const featuresByTier: Record<string, FeatureId[]> = {
  // ... other tiers
  premium: [
    // ... existing premium features
    FEATURES.NEW_FEATURE,
  ],
};
```

## Testing

The feature access system includes:

1. **Unit tests**: Test individual components and functions
2. **Integration tests**: Test the end-to-end feature access flow
3. **Performance tests**: Ensure efficient feature checking

## Best Practices

1. Always use the `FeatureGate` component or `useFeatureToggle` hook to gate feature access
2. Don't hard-code feature access checks
3. Use appropriate fallback content when feature access is denied
4. Track feature usage to gather metrics
5. Regularly review and clean up unused features
