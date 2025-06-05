
// Types Index - Phase 5 Cleaned
// Essential type definitions only

// Core types
export * from './userRole';
export * from './ProfileTypes';
export * from './notification';

// Component types (essential only)
export * from '../components/shared/types';
export * from '../components/auth/types';

// Chart types (centralized)
export * from './charts';

// Navigation and auth types
export * from './navigation';
export * from './auth';

// Type validation (Phase 9E enhancement)
export { 
  TypeValidationError,
  type ValidationResult,
  type TypeValidator,
  validateString,
  validateNumber,
  validateArray,
  devValidate
} from '../utils/typeValidation';
