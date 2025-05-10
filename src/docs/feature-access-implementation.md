# Feature Access System Implementation Guide

## System Overview

The Feature Access System is a comprehensive feature gating solution that allows fine-grained control over which users can access specific features based on their subscription tier, role, segment, or other criteria.

## Architecture

The system follows a layered architecture:

```
┌─────────────────────┐
│    UI Components    │ FeatureGate, useFeatureToggle
├─────────────────────┤
│    Context Layer    │ FeatureContext, useFeatures
├─────────────────────┤
│    Service Layer    │ checkFeatureAccess, trackFeatureEvent
├─────────────────────┤
│   Caching Layer     │ getCachedFeatureAccess, clearFeatureAccessCache
├─────────────────────┤
│  Persistence Layer  │ Supabase Database Functions
└─────────────────────┘
```

## Key Components

### 1. Feature Registry

The feature registry (`src/lib/features/registry.ts`) is the central definition for all features. It includes:

- Feature IDs - Unique identifiers for each feature
- Feature metadata - Name, description, category
- Default settings - Whether enabled by default
- Tier mappings - Which subscription tiers have access to which features

```typescript
// Example from registry.ts
export const FEATURES = {
  ADVANCED_ANALYTICS: 'FEATURE_ADVANCED_ANALYTICS',
  // Other features...
};

export const featureRegistry: Record<FeatureId, Feature> = {
  [FEATURES.ADVANCED_ANALYTICS]: {
    id: FEATURES.ADVANCED_ANALYTICS,
    name: 'Advanced Analytics',
    description: 'Access to advanced analytics and reporting',
    defaultEnabled: false,
    requiresSubscription: true,
    minimumTier: 'premium',
    category: 'analytics'
  },
  // Other feature definitions...
};
```

### 2. Feature Context

The `FeatureContext` provides React components with access to feature status:

```typescript
// Example usage of FeatureContext
const { hasAccess } = useFeatures();
const canAccessAdvancedAnalytics = hasAccess(FEATURES.ADVANCED_ANALYTICS);
```

### 3. FeatureGate Component

The `FeatureGate` component conditionally renders content based on feature access:

```tsx
<FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
  <AdvancedAnalytics />
</FeatureGate>
```

### 4. API Layer

The API layer handles communication with the backend:

```typescript
// Check if a user has access to a feature
const hasAccess = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);

// Track feature usage
trackFeatureEvent(FEATURES.ADVANCED_ANALYTICS, 'view');

// Batch check multiple features at once
const results = await batchCheckFeatureAccess([
  FEATURES.ADVANCED_ANALYTICS,
  FEATURES.BULK_MESSAGING
]);
```

## Database Structure

The system relies on several database tables:

1. **feature_flags**: Stores feature definitions and global state
   - `id`: UUID primary key
   - `name`: Feature identifier string (e.g., "FEATURE_ADVANCED_ANALYTICS")
   - `description`: Human-readable description
   - `status`: Boolean indicating if the feature is globally enabled
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

2. **subscription_features**: Maps features to subscription tiers
   - `id`: UUID primary key
   - `feature_id`: Foreign key to feature_flags
   - `tier_id`: Subscription tier identifier
   - `is_enabled`: Boolean indicating if the feature is enabled for this tier

3. **feature_metrics**: Tracks feature usage events
   - `id`: UUID primary key
   - `feature_id`: Foreign key to feature_flags
   - `user_id`: UUID of the user
   - `event_type`: Type of event (e.g., "view", "use")
   - `event_data`: JSON object with additional event data
   - `created_at`: Timestamp

4. **feature_segments**: Defines segments for targeted feature rollouts
   - `id`: UUID primary key
   - `name`: Segment name
   - `description`: Segment description
   - `criteria`: JSON object with segment membership criteria
   - `created_at`: Timestamp

## Performance Optimizations

The system includes several optimizations:

### Client-side Caching

```typescript
// Cache layer implementation
const featureAccessCache = new Map<string, CacheEntry>();

export function getCachedFeatureAccess(userId: string, featureId: FeatureId): boolean | null {
  const cacheKey = `${userId}:${featureId}`;
  const cacheEntry = featureAccessCache.get(cacheKey);
  
  if (!cacheEntry) return null;
  
  if (Date.now() - cacheEntry.timestamp > CACHE_TTL) {
    featureAccessCache.delete(cacheKey);
    return null;
  }
  
  return cacheEntry.value;
}
```

### Batch Loading

```typescript
// Batch check implementation
export async function batchCheckFeatureAccess(
  featureIds: FeatureId[]
): Promise<Record<FeatureId, boolean>> {
  // Implementation that optimizes API calls
}
```

### Admin Fast Path

```typescript
// Admin fast path implementation
const isAdmin = user?.user_metadata?.user_type === 'admin';
if (isAdmin) {
  return true; // Skip database check for admins
}
```

## Testing Approach

The system includes three types of tests:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test how components work together
3. **E2E Tests**: Test complete user journeys

Example test:

```typescript
// Unit test for feature access
it('should deny feature access when user is not logged in', async () => {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
    error: null,
  } as any);

  const result = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
  expect(result).toBe(false);
});
```

## Adding New Features

To add a new feature:

1. Add the feature to the `FEATURES` object in `registry.ts`:

```typescript
export const FEATURES = {
  // Existing features
  NEW_FEATURE: 'FEATURE_NEW_FEATURE',
};
```

2. Add the feature metadata to the registry:

```typescript
export const featureRegistry: Record<FeatureId, Feature> = {
  // Existing features
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
```

3. Add the feature to the appropriate tier:

```typescript
export const featuresByTier: Record<string, FeatureId[]> = {
  premium: [
    // Existing premium features
    FEATURES.NEW_FEATURE,
  ],
};
```

4. Add the feature to the database:

```sql
INSERT INTO feature_flags (name, description, status)
VALUES ('FEATURE_NEW_FEATURE', 'Description of the new feature', false);
```

## Best Practices

1. **Always use the FeatureGate component**: Don't bypass the gating mechanism

2. **Track feature usage**: Always track when features are used

3. **Cache efficiently**: Use batch loading when possible

4. **Test thoroughly**: Ensure all features are correctly gated

5. **Clean up old features**: Remove feature flags that are no longer needed

6. **Document all features**: Keep the registry updated

## Monitoring and Analytics

The system includes monitoring capabilities:

1. **Performance monitoring**: Track response times for feature checks

2. **Usage analytics**: Track which features are being used by which users

3. **Access logs**: Track denied accesses for troubleshooting

## Troubleshooting

Common issues and solutions:

1. **Feature not appearing**: Ensure the feature is enabled in the database and the user has the correct tier.

2. **Performance issues**: Check the cache is working properly and not being cleared too frequently.

3. **Inconsistent access**: Verify that the feature is consistently defined in both the registry and database.
