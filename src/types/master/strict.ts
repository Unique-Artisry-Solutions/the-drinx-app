
/**
 * Strict Type Enforcement - Enhanced TypeScript configuration
 * This file provides additional type safety and validation
 */

// Strict utility types
export type Exact<T, U> = T extends U ? (U extends T ? T : never) : never;

export type StrictPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type StrictOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Branded types for additional type safety
export type BrandedId<T extends string> = string & { __brand: T };

export type UserId = BrandedId<'User'>;
export type EstablishmentId = BrandedId<'Establishment'>;
export type EventId = BrandedId<'Event'>;
export type SwigCircuitId = BrandedId<'SwigCircuit'>;

// Type-safe prop validation
export type ValidatedProps<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : T[K];
};

// Strict enum definitions
export const USER_ROLES = ['individual', 'establishment', 'promoter', 'admin'] as const;
export const EVENT_STATUSES = ['draft', 'published', 'cancelled', 'completed'] as const;
export const NOTIFICATION_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

// Type predicates for runtime validation
export const isValidUserRole = (value: any): value is typeof USER_ROLES[number] => {
  return USER_ROLES.includes(value);
};

export const isValidEventStatus = (value: any): value is typeof EVENT_STATUSES[number] => {
  return EVENT_STATUSES.includes(value);
};

export const isValidNotificationPriority = (value: any): value is typeof NOTIFICATION_PRIORITIES[number] => {
  return NOTIFICATION_PRIORITIES.includes(value);
};

// Interface validation helpers
export const validateInterface = <T>(obj: unknown, validator: (obj: any) => obj is T): T => {
  if (!validator(obj)) {
    throw new Error('Object does not match expected interface');
  }
  return obj;
};

// Type-safe component prop builders
export type ComponentPropsBuilder<T> = {
  required: <K extends keyof T>(keys: K[]) => StrictPick<T, K>;
  optional: <K extends keyof T>(keys: K[]) => Partial<StrictPick<T, K>>;
  withDefaults: <K extends keyof T>(defaults: StrictPick<T, K>) => T;
};

// Error boundary types for type safety
export interface TypeSafeError {
  code: string;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
}

export const createTypeSafeError = (
  code: string,
  message: string,
  context?: Record<string, unknown>
): TypeSafeError => ({
  code,
  message,
  context,
  stack: new Error().stack
});

// Conditional types for complex validations
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type NullableFields<T, K extends keyof T> = Omit<T, K> & Partial<Record<K, T[K] | null>>;

// Type guards with improved error messages
export const createTypeGuard = <T>(
  predicate: (value: unknown) => value is T,
  errorMessage: string
) => {
  return (value: unknown): T => {
    if (!predicate(value)) {
      throw createTypeSafeError('TYPE_GUARD_FAILED', errorMessage, { value });
    }
    return value;
  };
};
