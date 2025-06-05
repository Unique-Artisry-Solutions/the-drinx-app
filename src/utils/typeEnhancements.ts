
// Phase 3 Alternative: Enhanced Type System (Additive Only)
// Provides safer type handling without changing existing types

import { UserType } from '@/types/navigation';

// Enhanced type guards (additive to existing userTypeGuards.ts)
export const safeTypeGuards = {
  // Enhanced user type validation
  isValidUserType: (value: unknown): value is UserType => {
    return typeof value === 'string' && 
      ['individual', 'establishment', 'promoter', 'admin'].includes(value);
  },
  
  // Safe object property checking
  hasProperty: <T extends object, K extends keyof any>(
    obj: T, 
    key: K
  ): obj is T & Record<K, unknown> => {
    return obj != null && typeof obj === 'object' && key in obj;
  },
  
  // Safe function checking
  isFunction: (value: unknown): value is Function => {
    return typeof value === 'function';
  },
  
  // Safe array checking
  isNonEmptyArray: <T>(value: unknown): value is T[] => {
    return Array.isArray(value) && value.length > 0;
  }
};

// Type conversion utilities
export const safeTypeConverters = {
  // Convert to user type with fallback
  toUserType: (value: unknown, fallback: UserType = 'individual'): UserType => {
    return safeTypeGuards.isValidUserType(value) ? value : fallback;
  },
  
  // Safe string conversion
  toString: (value: unknown, fallback: string = ''): string => {
    if (typeof value === 'string') return value;
    if (value == null) return fallback;
    return String(value);
  },
  
  // Safe number conversion
  toNumber: (value: unknown, fallback: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  },
  
  // Safe boolean conversion
  toBoolean: (value: unknown, fallback: boolean = false): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }
    if (typeof value === 'number') return value !== 0;
    return fallback;
  }
};

// Enhanced validation utilities
export const safeValidation = {
  // Validate object structure
  validateObject: <T extends Record<string, any>>(
    obj: unknown,
    requiredKeys: (keyof T)[],
    optionalKeys: (keyof T)[] = []
  ): { isValid: boolean; missing: string[]; extra: string[] } => {
    if (!obj || typeof obj !== 'object') {
      return { isValid: false, missing: requiredKeys as string[], extra: [] };
    }
    
    const objKeys = Object.keys(obj);
    const allValidKeys = [...requiredKeys, ...optionalKeys] as string[];
    const missing = requiredKeys.filter(key => !(key as string) in obj) as string[];
    const extra = objKeys.filter(key => !allValidKeys.includes(key));
    
    return { isValid: missing.length === 0, missing, extra };
  },
  
  // Validate array structure
  validateArray: <T>(
    arr: unknown,
    itemValidator: (item: unknown) => item is T
  ): { isValid: boolean; validItems: T[]; invalidCount: number } => {
    if (!Array.isArray(arr)) {
      return { isValid: false, validItems: [], invalidCount: 0 };
    }
    
    const validItems: T[] = [];
    let invalidCount = 0;
    
    arr.forEach(item => {
      if (itemValidator(item)) {
        validItems.push(item);
      } else {
        invalidCount++;
      }
    });
    
    return { isValid: invalidCount === 0, validItems, invalidCount };
  }
};
