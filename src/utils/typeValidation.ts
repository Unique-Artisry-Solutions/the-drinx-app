
// Type Validation System - Phase 9E
// Runtime validation for component props and data structures

export class TypeValidationError extends Error {
  constructor(
    public readonly validationType: string,
    public readonly expected: string,
    public readonly received: string
  ) {
    super(`Type validation failed: expected ${expected}, received ${received}`);
    this.name = 'TypeValidationError';
  }
}

export interface ValidationResult<T> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly errors: string[];
}

export abstract class TypeValidator<T> {
  abstract validate(value: unknown): ValidationResult<T>;
  
  protected createError(message: string): ValidationResult<T> {
    return {
      isValid: false,
      errors: [message]
    };
  }
  
  protected createSuccess(data: T): ValidationResult<T> {
    return {
      isValid: true,
      data,
      errors: []
    };
  }
}

export interface StringValidationOptions {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
}

export class StringValidator extends TypeValidator<string> {
  constructor(private options: StringValidationOptions = {}) {
    super();
  }

  validate(value: unknown): ValidationResult<string> {
    if (value === null || value === undefined) {
      if (this.options.required) {
        return this.createError('String is required');
      }
      return this.createSuccess('');
    }

    if (typeof value !== 'string') {
      return this.createError(`Expected string, got ${typeof value}`);
    }

    if (this.options.minLength && value.length < this.options.minLength) {
      return this.createError(`String must be at least ${this.options.minLength} characters`);
    }

    if (this.options.maxLength && value.length > this.options.maxLength) {
      return this.createError(`String must be at most ${this.options.maxLength} characters`);
    }

    if (this.options.pattern && !this.options.pattern.test(value)) {
      return this.createError('String does not match required pattern');
    }

    return this.createSuccess(value);
  }
}

export interface NumberValidationOptions {
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly integer?: boolean;
}

export class NumberValidator extends TypeValidator<number> {
  constructor(private options: NumberValidationOptions = {}) {
    super();
  }

  validate(value: unknown): ValidationResult<number> {
    if (value === null || value === undefined) {
      if (this.options.required) {
        return this.createError('Number is required');
      }
      return this.createSuccess(0);
    }

    const num = Number(value);
    if (isNaN(num)) {
      return this.createError(`Expected number, got ${typeof value}`);
    }

    if (this.options.integer && !Number.isInteger(num)) {
      return this.createError('Number must be an integer');
    }

    if (this.options.min !== undefined && num < this.options.min) {
      return this.createError(`Number must be at least ${this.options.min}`);
    }

    if (this.options.max !== undefined && num > this.options.max) {
      return this.createError(`Number must be at most ${this.options.max}`);
    }

    return this.createSuccess(num);
  }
}

export interface ArrayValidationOptions<T> {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly itemValidator?: TypeValidator<T>;
}

export class ArrayValidator<T> extends TypeValidator<T[]> {
  constructor(private options: ArrayValidationOptions<T> = {}) {
    super();
  }

  validate(value: unknown): ValidationResult<T[]> {
    if (value === null || value === undefined) {
      if (this.options.required) {
        return this.createError('Array is required');
      }
      return this.createSuccess([]);
    }

    if (!Array.isArray(value)) {
      return this.createError(`Expected array, got ${typeof value}`);
    }

    if (this.options.minLength && value.length < this.options.minLength) {
      return this.createError(`Array must have at least ${this.options.minLength} items`);
    }

    if (this.options.maxLength && value.length > this.options.maxLength) {
      return this.createError(`Array must have at most ${this.options.maxLength} items`);
    }

    if (this.options.itemValidator) {
      const errors: string[] = [];
      const validatedItems: T[] = [];

      for (let i = 0; i < value.length; i++) {
        const result = this.options.itemValidator.validate(value[i]);
        if (!result.isValid) {
          errors.push(`Item ${i}: ${result.errors.join(', ')}`);
        } else if (result.data !== undefined) {
          validatedItems.push(result.data);
        }
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          errors
        };
      }

      return this.createSuccess(validatedItems);
    }

    return this.createSuccess(value as T[]);
  }
}

// Convenience validation functions
export function validateString(
  value: unknown,
  options?: StringValidationOptions
): ValidationResult<string> {
  return new StringValidator(options).validate(value);
}

export function validateNumber(
  value: unknown,
  options?: NumberValidationOptions
): ValidationResult<number> {
  return new NumberValidator(options).validate(value);
}

export function validateArray<T>(
  value: unknown,
  options?: ArrayValidationOptions<T>
): ValidationResult<T[]> {
  return new ArrayValidator(options).validate(value);
}

// Development-only validation helper
export function devValidate<T>(
  validator: TypeValidator<T>,
  value: unknown,
  context?: string
): T | null {
  if (process.env.NODE_ENV !== 'development') {
    return value as T;
  }

  const result = validator.validate(value);
  
  if (!result.isValid) {
    console.warn(`Validation failed${context ? ` in ${context}` : ''}:`, result.errors);
    return null;
  }

  return result.data || null;
}

// Enhanced function validation with proper constraints
export function validateFunction<T extends (...args: any[]) => any>(
  value: unknown,
  context?: string
): T | null {
  if (typeof value !== 'function') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Function validation failed${context ? ` in ${context}` : ''}: expected function, got ${typeof value}`);
    }
    return null;
  }
  return value as T;
}

export function validateFunctionOptional<T extends (...args: any[]) => any>(
  value: unknown,
  context?: string
): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return validateFunction<T>(value, context) || undefined;
}

// Generic validation with proper function constraint
export function validateGeneric<T extends (...args: any[]) => any>(
  value: unknown,
  validatorFn: T,
  context?: string
): ReturnType<T> | null {
  try {
    return validatorFn(value);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Generic validation failed${context ? ` in ${context}` : ''}:`, error);
    }
    return null;
  }
}
