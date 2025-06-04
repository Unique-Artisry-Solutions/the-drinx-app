
// Types Index - Phase 9E Enhanced
// Centralized type definitions with strict validation support

// Core types
export * from './userRole';
export * from './ProfileTypes';
export * from './notification';

// Enhanced standard types (Phase 9E)
export * from './shared/StandardTypes';

// Admin types
export * from './admin/TabTypes';

// Component types
export * from '../components/shared/types';
export * from '../components/auth/types';

// Chart types (centralized)
export * from './charts';

// Type validation exports
export { 
  TypeValidationError,
  type ValidationResult,
  type TypeValidator,
  StringValidator,
  NumberValidator,
  ArrayValidator,
  validateString,
  validateNumber,
  validateArray,
  devValidate
} from '../utils/typeValidation';
