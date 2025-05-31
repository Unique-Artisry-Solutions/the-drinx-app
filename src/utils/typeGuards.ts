import { Json } from '@/integrations/supabase/types';

/**
 * Legacy type guards - maintained for backward compatibility
 * New code should use the comprehensive type guard system in utils/typeGuards/
 */

// Re-export the enhanced type guard system
export * from './typeGuards/index';

// Legacy functions - redirected to new implementation
import { 
  safeJsonToRecord as newSafeJsonToRecord,
  safeJsonToArray as newSafeJsonToArray,
  safeJsonToString as newSafeJsonToString,
  safeJsonToNumber as newSafeJsonToNumber,
  isNonEmptyString as newIsNonEmptyString,
  isNumber as newIsValidNumber,
  isString
} from './typeGuards/coreTypeGuards';

export const safeJsonToRecord = newSafeJsonToRecord;
export const safeJsonToArray = newSafeJsonToArray;
export const safeJsonToString = newSafeJsonToString;
export const safeJsonToNumber = newSafeJsonToNumber;
export const isNonEmptyString = newIsNonEmptyString;
export const isValidNumber = newIsValidNumber;

// Keep existing utility functions
export const exists = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

// Enhanced generic type converter using new validation
export const safeJsonToType = <T>(json: any, defaultValue: T): T => {
  if (json === null || json === undefined) {
    return defaultValue;
  }
  
  // If it's already the expected type, return it
  if (typeof json === typeof defaultValue) {
    return json as T;
  }
  
  // Try to parse if it's a string
  if (isString(json)) {
    try {
      const parsed = JSON.parse(json);
      return parsed as T;
    } catch {
      return defaultValue;
    }
  }
  
  // For objects, merge with default
  if (typeof json === 'object' && typeof defaultValue === 'object' && !Array.isArray(json)) {
    return { ...defaultValue, ...json } as T;
  }
  
  return defaultValue;
};

// Enhanced JSON conversion with validation
export const toJsonCompatible = (value: any): any => {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => toJsonCompatible(item));
  }
  
  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = toJsonCompatible(val);
    }
    return result;
  }
  
  // Fallback to string conversion
  return String(value);
};
