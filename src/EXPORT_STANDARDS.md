
# Export Standardization Guide - Phase 9A

## Overview
Phase 9A establishes consistent export patterns across the entire codebase to improve tree-shaking, bundle optimization, and developer experience.

## Export Standards

### 1. Named Exports Only
**✅ Do:**
```typescript
export const MyComponent: React.FC = () => { ... };
export const myUtility = () => { ... };
export class MyService { ... }
```

**❌ Don't:**
```typescript
export default MyComponent;
const MyComponent = () => { ... };
export default MyComponent;
```

### 2. Barrel Exports
**✅ Do:**
```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Label } from './label';
```

**❌ Don't:**
```typescript
// src/components/ui/index.ts
export { default as Button } from './button';
export { default as Input } from './input';
```

### 3. Type Exports
**✅ Do:**
```typescript
export type { ComponentProps } from './types';
export interface ServiceConfig { ... }
```

### 4. Service Exports
**✅ Do:**
```typescript
export class UnifiedAnalyticsService { ... }
export const AnalyticsService = UnifiedAnalyticsService; // Alias for convenience
```

### 5. Component Exports
**✅ Do:**
```typescript
export const StandardPageLayout: React.FC<Props> = ({ ... }) => { ... };
export const StandardPageHeader: React.FC<Props> = ({ ... }) => { ... };
```

## Benefits

### Tree Shaking
- Named exports enable better dead code elimination
- Bundlers can remove unused code more effectively
- Smaller production bundles

### Developer Experience
- Clear import/export patterns
- Better IDE support and autocomplete
- Easier refactoring and code navigation

### Bundle Optimization
- Reduced bundle size through better tree shaking
- Improved code splitting capabilities
- Better dependency analysis

## Migration Strategy

### Phase 1: Core Components ✅ COMPLETED
- Shared components (StandardPageLayout, etc.)
- UI components barrel exports
- Basic utility functions

### Phase 2: Services (Next)
- Service exports standardization
- Hook exports standardization
- Type exports consolidation

### Phase 3: Pages and Features (Future)
- Page component exports
- Feature module exports
- Route component exports

## Enforcement

### ESLint Rules (Recommended)
```json
{
  "rules": {
    "import/no-default-export": "error",
    "import/prefer-default-export": "off"
  }
}
```

### Code Review Guidelines
1. All new components must use named exports
2. Barrel exports required for index files
3. No default exports except for Next.js pages (if applicable)
4. Consistent naming conventions

## Examples

### Before (Phase 8 and earlier)
```typescript
// Component
const Layout = () => { ... };
export default Layout;

// Import
import Layout from '@/components/Layout';
```

### After (Phase 9A)
```typescript
// Component
export const Layout: React.FC = () => { ... };

// Import
import { Layout } from '@/components/Layout';
```

## Next Steps

1. **Phase 9B**: Remove deprecated default exports
2. **Phase 9C**: Implement component modularization
3. **Phase 9D**: Complete service migration
4. **Phase 9E**: Add strict type checking

This standardization provides a solid foundation for future development and maintainability.
