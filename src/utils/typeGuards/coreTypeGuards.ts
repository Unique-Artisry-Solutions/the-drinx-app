
/**
 * Core type guards for essential application data types
 * Provides runtime validation for critical data flows
 */

import { Json } from '@/integrations/supabase/types';

// ===== DISCRIMINATED UNIONS =====
// User type discriminated union
export type UserVariant = 
  | { type: 'individual'; preferences: { notifications: boolean } }
  | { type: 'establishment'; businessInfo: { hours: string; capacity: number } }
  | { type: 'promoter'; marketing: { campaigns: number; budget: number } }
  | { type: 'admin'; permissions: { level: string; modules: string[] } };

// Event status discriminated union
export type EventStatusVariant =
  | { status: 'draft'; canEdit: true; publishedAt: null }
  | { status: 'published'; canEdit: false; publishedAt: string }
  | { status: 'cancelled'; canEdit: false; cancelledAt: string }
  | { status: 'completed'; canEdit: false; completedAt: string };

// Payment status discriminated union
export type PaymentStatusVariant =
  | { status: 'pending'; retryCount: number; nextRetry: string }
  | { status: 'completed'; completedAt: string; transactionId: string }
  | { status: 'failed'; errorCode: string; errorMessage: string }
  | { status: 'refunded'; refundedAt: string; refundAmount: number };

// ===== BASIC TYPE GUARDS =====
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isNonEmptyString = (value: unknown): value is string => {
  return isString(value) && value.trim().length > 0;
};

export const isPositiveNumber = (value: unknown): value is number => {
  return isNumber(value) && value > 0;
};

export const isValidEmail = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isValidUrl = (value: unknown): value is string => {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// ===== USER TYPE GUARDS =====
export const isValidUserType = (value: unknown): value is 'individual' | 'establishment' | 'promoter' | 'admin' => {
  return isString(value) && ['individual', 'establishment', 'promoter', 'admin'].includes(value);
};

export const isUserVariant = (value: unknown): value is UserVariant => {
  if (!isObject(value) || !('type' in value)) return false;
  
  const { type } = value;
  
  switch (type) {
    case 'individual':
      return isObject(value.preferences) && isBoolean((value.preferences as any).notifications);
    case 'establishment':
      return isObject(value.businessInfo) && 
             isString((value.businessInfo as any).hours) && 
             isNumber((value.businessInfo as any).capacity);
    case 'promoter':
      return isObject(value.marketing) && 
             isNumber((value.marketing as any).campaigns) && 
             isNumber((value.marketing as any).budget);
    case 'admin':
      return isObject(value.permissions) && 
             isString((value.permissions as any).level) && 
             isArray((value.permissions as any).modules);
    default:
      return false;
  }
};

// ===== EVENT STATUS TYPE GUARDS =====
export const isValidEventStatus = (value: unknown): value is 'draft' | 'published' | 'cancelled' | 'completed' => {
  return isString(value) && ['draft', 'published', 'cancelled', 'completed'].includes(value);
};

export const isEventStatusVariant = (value: unknown): value is EventStatusVariant => {
  if (!isObject(value) || !('status' in value)) return false;
  
  const { status } = value;
  
  switch (status) {
    case 'draft':
      return value.canEdit === true && value.publishedAt === null;
    case 'published':
      return value.canEdit === false && isString(value.publishedAt);
    case 'cancelled':
      return value.canEdit === false && isString(value.cancelledAt);
    case 'completed':
      return value.canEdit === false && isString(value.completedAt);
    default:
      return false;
  }
};

// ===== PAYMENT STATUS TYPE GUARDS =====
export const isValidPaymentStatus = (value: unknown): value is 'pending' | 'completed' | 'failed' | 'refunded' => {
  return isString(value) && ['pending', 'completed', 'failed', 'refunded'].includes(value);
};

export const isPaymentStatusVariant = (value: unknown): value is PaymentStatusVariant => {
  if (!isObject(value) || !('status' in value)) return false;
  
  const { status } = value;
  
  switch (status) {
    case 'pending':
      return isNumber(value.retryCount) && isString(value.nextRetry);
    case 'completed':
      return isString(value.completedAt) && isString(value.transactionId);
    case 'failed':
      return isString(value.errorCode) && isString(value.errorMessage);
    case 'refunded':
      return isString(value.refundedAt) && isNumber(value.refundAmount);
    default:
      return false;
  }
};

// ===== JSON CONVERSION UTILITIES =====
export const safeJsonToRecord = (json: Json): Record<string, any> => {
  if (isObject(json)) {
    return json as Record<string, any>;
  }
  return {};
};

export const safeJsonToArray = (json: Json): any[] => {
  if (isArray(json)) {
    return json;
  }
  return [];
};

export const safeJsonToString = (json: Json): string => {
  if (isString(json)) {
    return json;
  }
  if (isObject(json) || isArray(json)) {
    return JSON.stringify(json);
  }
  return String(json || '');
};

export const safeJsonToNumber = (json: Json): number => {
  if (isNumber(json)) {
    return json;
  }
  if (isString(json)) {
    const parsed = parseFloat(json);
    return isNumber(parsed) ? parsed : 0;
  }
  return 0;
};

// ===== GENERIC TYPE VALIDATOR =====
export const validateWithGuard = <T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  errorMessage?: string
): T => {
  if (!guard(value)) {
    throw new Error(errorMessage || `Value failed type validation: ${JSON.stringify(value)}`);
  }
  return value;
};

// ===== BATCH VALIDATION =====
export const validateArray = <T>(
  values: unknown[],
  guard: (value: unknown) => value is T,
  errorMessage?: string
): T[] => {
  return values.map((value, index) => 
    validateWithGuard(value, guard, `${errorMessage || 'Array validation failed'} at index ${index}`)
  );
};
