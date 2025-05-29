
# TypeScript Guidelines for Swig App

## Core Principles

### 1. Strict Union Type Enforcement
- Always use specific union types instead of generic `string` types
- Define allowed values explicitly in type definitions
- Example: `type FilterType = 'all' | 'friends' | 'nearby'` instead of `string`

### 2. Single Source of Truth for Types
- All related types should be defined in a central location
- Use `src/types/[domain]/index.ts` pattern for type organization
- Import types from the canonical source, not from component files

### 3. Interface Compatibility Matrix
- When extending interfaces, ensure all required properties are included
- Use composition over inheritance when interfaces differ significantly
- Document interface relationships and dependencies

### 4. Export Consistency Rule
- Components should have a default export AND a named export when used extensively
- Always use `export default ComponentName` for React components
- Use named exports for utility functions and secondary components

### 5. Type-Safe Handler Patterns
- Define handler interfaces with specific parameter types
- Example: `interface FilterHandler { (value: FilterType): void; }`
- Avoid generic handlers that accept `any` or overly broad types

### 6. Strict JSX/TS Separation
- Never use JSX elements in `.ts` files
- Use metadata/string identifiers for components referenced in hooks
- Implement component mapping in the UI layer, not the logic layer

## Implementation Checklist

Before creating or modifying components:

1. **Type Definition Check**
   - [ ] Are all union types strictly defined?
   - [ ] Are handler functions properly typed?
   - [ ] Are interfaces complete and accurate?

2. **Import/Export Validation**
   - [ ] Do all imports resolve to existing exports?
   - [ ] Are component exports consistent (default + named)?
   - [ ] Are type imports using the canonical source?

3. **Interface Compatibility**
   - [ ] Do extended interfaces include all required properties?
   - [ ] Are optional properties properly marked?
   - [ ] Do function signatures match their usage?

4. **File Organization**
   - [ ] Are types in the appropriate domain folder?
   - [ ] Is the component using .tsx extension for JSX content?
   - [ ] Are related types co-located logically?

## Common Anti-Patterns to Avoid

### ❌ Generic String Types
```typescript
// Bad
interface Handler {
  (value: string): void;
}

// Good
type FilterType = 'all' | 'friends' | 'nearby';
interface FilterHandler {
  (value: FilterType): void;
}
```

### ❌ JSX in .ts Files
```typescript
// Bad - in useHook.ts
const icon = <MapPin className="h-4 w-4" />;

// Good - in useHook.ts
const iconName = 'MapPin';
```

### ❌ Inconsistent Exports
```typescript
// Bad
export { ComponentName }; // Only named export

// Good
export default ComponentName;
export { ComponentName };
```

### ❌ Interface Extension Without Required Properties
```typescript
// Bad
interface ExtendedActivity extends Activity {
  // Missing required properties like 'likes', 'isLiked'
}

// Good
interface RealtimeActivity extends Activity {
  likes: number;
  isLiked: boolean;
  // All required properties included
}
```

## Error Prevention Strategies

1. **Build-Time Validation**: Use TypeScript strict mode
2. **Consistent Naming**: Follow PascalCase for types, camelCase for properties
3. **Documentation**: Comment complex type relationships
4. **Regular Audits**: Periodically review type definitions for consistency

## Type Organization Structure

```
src/types/
├── explore/
│   └── index.ts           # All explore-related types
├── auth/
│   └── index.ts           # Authentication types
├── events/
│   └── index.ts           # Event management types
└── shared/
    └── index.ts           # Common/shared types
```

This structure ensures types are discoverable and maintainable while preventing circular dependencies and import conflicts.
