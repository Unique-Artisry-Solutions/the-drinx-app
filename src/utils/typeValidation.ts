
// Runtime Type Validation - Phase 9E
// Strict runtime validation for component props

export class TypeValidationError extends Error {
  constructor(
    public readonly field: string,
    public readonly expected: string,
    public readonly received: string
  ) {
    super(`Type validation failed for '${field}': expected ${expected}, received ${received}`);
    this.name = 'TypeValidationError';
  }
}

// Validation result type
export interface ValidationResult<T = any> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly errors: readonly TypeValidationError[];
}

// Base validator interface
export interface TypeValidator<T> {
  validate(value: unknown): ValidationResult<T>;
}

// String validator
export class StringValidator implements TypeValidator<string> {
  constructor(
    private readonly options: {
      readonly required?: boolean;
      readonly minLength?: number;
      readonly maxLength?: number;
      readonly pattern?: RegExp;
    } = {}
  ) {}

  validate(value: unknown): ValidationResult<string> {
    const errors: TypeValidationError[] = [];

    if (this.options.required && (value === null || value === undefined || value === '')) {
      errors.push(new TypeValidationError('value', 'required string', typeof value));
      return { isValid: false, errors };
    }

    if (value !== null && value !== undefined && typeof value !== 'string') {
      errors.push(new TypeValidationError('value', 'string', typeof value));
      return { isValid: false, errors };
    }

    const stringValue = value as string;

    if (this.options.minLength && stringValue.length < this.options.minLength) {
      errors.push(new TypeValidationError(
        'value.length',
        `>= ${this.options.minLength}`,
        stringValue.length.toString()
      ));
    }

    if (this.options.maxLength && stringValue.length > this.options.maxLength) {
      errors.push(new TypeValidationError(
        'value.length',
        `<= ${this.options.maxLength}`,
        stringValue.length.toString()
      ));
    }

    if (this.options.pattern && !this.options.pattern.test(stringValue)) {
      errors.push(new TypeValidationError(
        'value.pattern',
        this.options.pattern.toString(),
        'pattern mismatch'
      ));
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? stringValue : undefined,
      errors
    };
  }
}

// Number validator
export class NumberValidator implements TypeValidator<number> {
  constructor(
    private readonly options: {
      readonly required?: boolean;
      readonly min?: number;
      readonly max?: number;
      readonly integer?: boolean;
    } = {}
  ) {}

  validate(value: unknown): ValidationResult<number> {
    const errors: TypeValidationError[] = [];

    if (this.options.required && (value === null || value === undefined)) {
      errors.push(new TypeValidationError('value', 'required number', typeof value));
      return { isValid: false, errors };
    }

    if (value !== null && value !== undefined && typeof value !== 'number') {
      errors.push(new TypeValidationError('value', 'number', typeof value));
      return { isValid: false, errors };
    }

    const numberValue = value as number;

    if (isNaN(numberValue)) {
      errors.push(new TypeValidationError('value', 'valid number', 'NaN'));
    }

    if (this.options.min !== undefined && numberValue < this.options.min) {
      errors.push(new TypeValidationError(
        'value',
        `>= ${this.options.min}`,
        numberValue.toString()
      ));
    }

    if (this.options.max !== undefined && numberValue > this.options.max) {
      errors.push(new TypeValidationError(
        'value',
        `<= ${this.options.max}`,
        numberValue.toString()
      ));
    }

    if (this.options.integer && !Number.isInteger(numberValue)) {
      errors.push(new TypeValidationError('value', 'integer', 'float'));
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? numberValue : undefined,
      errors
    };
  }
}

// Array validator
export class ArrayValidator<T> implements TypeValidator<T[]> {
  constructor(
    private readonly itemValidator: TypeValidator<T>,
    private readonly options: {
      readonly required?: boolean;
      readonly minLength?: number;
      readonly maxLength?: number;
    } = {}
  ) {}

  validate(value: unknown): ValidationResult<T[]> {
    const errors: TypeValidationError[] = [];

    if (this.options.required && (value === null || value === undefined)) {
      errors.push(new TypeValidationError('value', 'required array', typeof value));
      return { isValid: false, errors };
    }

    if (value !== null && value !== undefined && !Array.isArray(value)) {
      errors.push(new TypeValidationError('value', 'array', typeof value));
      return { isValid: false, errors };
    }

    const arrayValue = value as unknown[];

    if (this.options.minLength && arrayValue.length < this.options.minLength) {
      errors.push(new TypeValidationError(
        'value.length',
        `>= ${this.options.minLength}`,
        arrayValue.length.toString()
      ));
    }

    if (this.options.maxLength && arrayValue.length > this.options.maxLength) {
      errors.push(new TypeValidationError(
        'value.length',
        `<= ${this.options.maxLength}`,
        arrayValue.length.toString()
      ));
    }

    // Validate each item
    const validatedItems: T[] = [];
    arrayValue.forEach((item, index) => {
      const itemResult = this.itemValidator.validate(item);
      if (!itemResult.isValid) {
        itemResult.errors.forEach(error => {
          errors.push(new TypeValidationError(
            `value[${index}].${error.field}`,
            error.expected,
            error.received
          ));
        });
      } else if (itemResult.data !== undefined) {
        validatedItems.push(itemResult.data);
      }
    });

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? validatedItems : undefined,
      errors
    };
  }
}

// Convenience validation functions
export const validateString = (value: unknown, options?: Parameters<typeof StringValidator.prototype.constructor>[0]) => {
  return new StringValidator(options).validate(value);
};

export const validateNumber = (value: unknown, options?: Parameters<typeof NumberValidator.prototype.constructor>[0]) => {
  return new NumberValidator(options).validate(value);
};

export const validateArray = <T>(
  value: unknown, 
  itemValidator: TypeValidator<T>, 
  options?: Parameters<typeof ArrayValidator.prototype.constructor>[1]
) => {
  return new ArrayValidator(itemValidator, options).validate(value);
};

// Development mode validation (only runs in dev)
export const devValidate = <T>(validator: TypeValidator<T>, value: unknown, context?: string): T | null => {
  if (process.env.NODE_ENV !== 'development') {
    return value as T;
  }

  const result = validator.validate(value);
  if (!result.isValid) {
    console.warn(`Type validation failed${context ? ` in ${context}` : ''}:`, result.errors);
    return null;
  }

  return result.data || null;
};
