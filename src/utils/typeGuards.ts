
import { Json } from '@/integrations/supabase/types';

export const safeJsonToRecord = (json: Json): Record<string, any> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};

export const safeJsonToArray = (json: Json): any[] => {
  if (Array.isArray(json)) {
    return json;
  }
  return [];
};

export const safeJsonToString = (json: Json): string => {
  if (typeof json === 'string') {
    return json;
  }
  if (typeof json === 'object' && json !== null) {
    return JSON.stringify(json);
  }
  return '';
};

export const safeJsonToNumber = (json: Json): number => {
  if (typeof json === 'number') {
    return json;
  }
  if (typeof json === 'string') {
    const parsed = parseFloat(json);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Generic type-safe JSON to Type converter
export const safeJsonToType = <T>(json: Json, defaultValue: T): T => {
  if (json === null || json === undefined) {
    return defaultValue;
  }
  
  // If it's already the expected type, return it
  if (typeof json === typeof defaultValue) {
    return json as T;
  }
  
  // Try to parse if it's a string
  if (typeof json === 'string') {
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

// Basic type checking utilities
export const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const exists = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

// JSON conversion utilities for database operations
export const toJsonCompatible = (value: any): Json => {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  
  if (Array.isArray(value)) {
    return value.map(item => toJsonCompatible(item)) as Json;
  }
  
  if (typeof value === 'object') {
    const result: Record<string, Json> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = toJsonCompatible(val);
    }
    return result;
  }
  
  // Fallback to string conversion
  return String(value);
};
