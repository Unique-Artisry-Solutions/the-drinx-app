
# Type System Migration Guide

## Overview
We've refactored our type system to use a single source of truth pattern to eliminate duplication and reduce build errors.

## Core Principles

### 1. Single Source of Truth
All core entities (User, Establishment, Event, etc.) are defined once in `CoreTypes.ts`

### 2. Composition Over Duplication  
Use TypeScript utility types to create variations:
```typescript
// Instead of duplicating interfaces, use composition
type EstablishmentCard = Pick<Establishment, 'id' | 'name' | 'address' | 'image'>;
type EstablishmentSummary = Pick<Establishment, 'id' | 'name' | 'address'>;
```

### 3. Consistent Optional Properties
- All `id` fields are required on existing entities
- All timestamp fields (`created_at`, `updated_at`) are optional
- Contact information (email, phone) is optional
- Media fields (image, avatar) are optional

## Migration Steps

### For New Components
1. Import types from `CoreTypes.ts` first
2. Only create new interfaces if they extend core types significantly
3. Use composition patterns for variations

### For Existing Components
1. Replace local type definitions with imports from `CoreTypes.ts`
2. Use composition types instead of duplicated interfaces
3. Update prop interfaces to use core types

## Example Usage

```typescript
// ✅ Good - Import from core types
import { User, Establishment, EstablishmentCard } from '@/types/CoreTypes';

// ✅ Good - Use composition for variations
type ProfileUser = Pick<User, 'id' | 'name' | 'avatar' | 'bio'>;

// ❌ Bad - Don't duplicate core interfaces
interface MyUser {
  id: string;
  name: string;
  // ... duplicating User interface
}
```

## File Structure
```
src/types/
├── CoreTypes.ts          # Single source of truth for all core entities
├── ProfileTypes.ts       # Profile-specific extensions
├── EventTypes.ts         # Event-specific extensions  
├── navigation/           # Navigation-specific types
└── README.md            # This guide
```

## Breaking Changes
- Some interfaces have been moved to `CoreTypes.ts`
- Removed duplicate definitions
- Standardized optional property patterns
- Updated import paths in some files

## Benefits
- Eliminates type duplication
- Reduces build errors from mismatched interfaces
- Easier maintenance and updates
- Better IDE support and autocomplete
- Clearer dependency relationships
