
// Generic form interfaces to reduce duplication across form components

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { BaseFormFieldProps, BaseModalProps, BaseActionProps } from './BaseInterfaces';

// Generic form props that can be used across different form types
export interface BaseFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  className?: string;
}

// Generic form field component props
export interface GenericFormFieldProps<T extends FieldValues> extends BaseFormFieldProps {
  name: Path<T>;
  form: UseFormReturn<T>;
}

// Generic form modal props
export interface BaseFormModalProps<T extends FieldValues> extends BaseModalProps, BaseFormProps<T> {
  onCancel?: () => void;
  cancelButtonText?: string;
}

// Generic form dialog actions
export interface BaseFormDialogActions extends BaseActionProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
}

// Generic validation rule interface
export interface BaseValidationRules {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  validate?: (value: any) => boolean | string;
}

// Generic form section interface
export interface BaseFormSection {
  title: string;
  description?: string;
  fields: string[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

// Generic form configuration
export interface BaseFormConfig<T extends FieldValues> {
  fields: Partial<Record<keyof T, BaseValidationRules>>;
  sections?: BaseFormSection[];
  submitButton?: BaseActionProps;
  resetButton?: BaseActionProps;
}
