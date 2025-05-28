# Rewards Type System Architecture

## Overview

The rewards system uses a layered type architecture to ensure type safety, maintainability, and clear separation of concerns across the application stack.

## Type Layers

### 1. Database Types (`src/types/database/`)
Direct mappings to Supabase database tables with snake_case naming conventions.

```typescript
interface DbRewardTier {
  id: string;
  name: string;
  points_required: number;
  establishment_id: string;
  // ... other database fields
}
```

### 2. API Types (`src/types/api/`)
Types for API responses and edge function returns, often including computed fields.

```typescript
interface ApiRewardTier extends DbRewardTier {
  is_active: boolean; // computed field
  user_count?: number; // aggregated data
}
```

### 3. Component Types (`src/types/components/`)
UI-optimized types with camelCase naming and component-specific properties.

```typescript
interface ComponentRewardTier {
  id: string;
  name: string;
  minimumPoints: number; // camelCase
  isActive: boolean;
  userCount?: number;
}
```

## Transformation Functions

### Adapter Pattern
Located in `src/lib/adapters/rewardAdapters.ts`, these functions transform between type layers:

```typescript
// Database → API
export const dbToApiTier = (dbTier: DbRewardTier): ApiRewardTier => ({
  ...dbTier,
  is_active: dbTier.status === 'active'
});

// API → Component
export const apiToComponentTier = (apiTier: ApiRewardTier): ComponentRewardTier => ({
  id: apiTier.id,
  name: apiTier.name,
  minimumPoints: apiTier.points_required,
  isActive: apiTier.is_active
});
```

## Development Tooling

### Mock Data Factory
`src/lib/development/mockDataFactory.ts` provides type-safe mock data generation:

```typescript
const mockTier = createMockRewardTier({
  name: 'Custom Tier',
  minimumPoints: 500
});
```

### Runtime Type Validation
`src/lib/development/typeValidation.ts` provides runtime type checking:

```typescript
import { assertRewardTier } from '@/lib/development/typeValidation';

// Throws detailed error if type validation fails
const validTier = assertRewardTier(unknownData, 'API response');
```

## Best Practices

### 1. Type Layer Separation
- Never mix database types directly in UI components
- Always transform through appropriate adapters
- Use component types in React components

### 2. Backward Compatibility
- Maintain legacy type exports during migration
- Use transform functions for gradual migration
- Document breaking changes

### 3. Error Handling
- Use runtime validation in development
- Provide meaningful error messages
- Log type mismatches for debugging

### 4. Testing
- Test transformation functions thoroughly
- Use mock factories for consistent test data
- Validate type constraints in tests

## Migration Strategy

### Phase 1: Separate Concerns ✅
- Created distinct type layers
- Established transformation functions

### Phase 2: Implement Adapters ✅
- Built adapter functions
- Added runtime validation

### Phase 3: Gradual Migration ✅
- Migrated problematic components
- Maintained backward compatibility

### Phase 4: Development Tooling ✅
- Added mock data factories
- Implemented type validation
- Created documentation

## Common Patterns

### Data Fetching
```typescript
// Fetch from database
const dbData = await supabase.from('reward_tiers').select('*');

// Transform for API
const apiData = dbData.map(dbToApiTier);

// Transform for components
const componentData = apiData.map(apiToComponentTier);
```

### Component Props
```typescript
interface TierCardProps {
  tier: ComponentRewardTier; // Always use component types
  onEdit: (tier: ComponentRewardTier) => void;
}
```

### API Endpoints
```typescript
// Edge function response
return Response.json({
  data: dbResults.map(dbToApiTier),
  success: true
});
```

## Troubleshooting

### Common Issues
1. **Type Mismatches**: Use appropriate transform functions
2. **Missing Properties**: Check type definitions and adapters
3. **Runtime Errors**: Enable type validation in development

### Debug Steps
1. Check which type layer is being used
2. Verify transform function usage
3. Use runtime validation to identify issues
4. Review mock data for correct structure
