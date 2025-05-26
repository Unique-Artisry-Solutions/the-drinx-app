
/**
 * Runtime validation utilities for analytics data integrity
 */

import { AnalyticsError, PerformanceMetric } from '@/services/analyticsMonitoring';

// Validation error type
export interface ValidationError {
  field: string;
  expected: string;
  received: string;
  message: string;
}

// Generic validator function type
export type Validator<T> = (data: any) => { isValid: boolean; errors: ValidationError[]; data?: T };

// Validate AnalyticsError structure
export const validateAnalyticsError: Validator<AnalyticsError> = (data: any) => {
  const errors: ValidationError[] = [];
  
  // Check required string fields
  const requiredStringFields = ['service', 'method', 'error', 'timestamp'];
  for (const field of requiredStringFields) {
    if (typeof data[field] !== 'string') {
      errors.push({
        field,
        expected: 'string',
        received: typeof data[field],
        message: `${field} must be a string`
      });
    }
  }
  
  // Check timestamp format
  if (typeof data.timestamp === 'string') {
    const date = new Date(data.timestamp);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'timestamp',
        expected: 'valid ISO string',
        received: data.timestamp,
        message: 'timestamp must be a valid ISO date string'
      });
    }
  }
  
  // Check context is object or undefined
  if (data.context !== undefined && (typeof data.context !== 'object' || data.context === null)) {
    errors.push({
      field: 'context',
      expected: 'object or undefined',
      received: typeof data.context,
      message: 'context must be an object or undefined'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data as AnalyticsError : undefined
  };
};

// Validate PerformanceMetric structure
export const validatePerformanceMetric: Validator<PerformanceMetric> = (data: any) => {
  const errors: ValidationError[] = [];
  
  // Check required string fields
  const requiredStringFields = ['service', 'method', 'timestamp'];
  for (const field of requiredStringFields) {
    if (typeof data[field] !== 'string') {
      errors.push({
        field,
        expected: 'string',
        received: typeof data[field],
        message: `${field} must be a string`
      });
    }
  }
  
  // Check numeric fields
  if (typeof data.duration !== 'number' || data.duration < 0) {
    errors.push({
      field: 'duration',
      expected: 'positive number',
      received: typeof data.duration,
      message: 'duration must be a positive number'
    });
  }
  
  // Check boolean field
  if (typeof data.success !== 'boolean') {
    errors.push({
      field: 'success',
      expected: 'boolean',
      received: typeof data.success,
      message: 'success must be a boolean'
    });
  }
  
  // Check timestamp format
  if (typeof data.timestamp === 'string') {
    const date = new Date(data.timestamp);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'timestamp',
        expected: 'valid ISO string',
        received: data.timestamp,
        message: 'timestamp must be a valid ISO date string'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data as PerformanceMetric : undefined
  };
};

// Generic validation runner
export function validateData<T>(
  data: any,
  validator: Validator<T>,
  dataType: string
): T | null {
  const result = validator(data);
  
  if (!result.isValid) {
    console.error(`Validation failed for ${dataType}:`, result.errors);
    return null;
  }
  
  return result.data || null;
}

// Batch validation for arrays
export function validateBatch<T>(
  dataArray: any[],
  validator: Validator<T>,
  dataType: string
): T[] {
  const validItems: T[] = [];
  const errors: string[] = [];
  
  dataArray.forEach((item, index) => {
    const validatedItem = validateData(item, validator, `${dataType}[${index}]`);
    if (validatedItem) {
      validItems.push(validatedItem);
    } else {
      errors.push(`Item at index ${index} failed validation`);
    }
  });
  
  if (errors.length > 0) {
    console.warn(`Batch validation completed with ${errors.length} errors:`, errors);
  }
  
  return validItems;
}
