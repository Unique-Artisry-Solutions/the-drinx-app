
/**
 * Form interfaces to reduce duplication across form components
 * 
 * Naming Conventions:
 * - Props: Component prop interfaces for form components
 * - Data: Form data structures and validation rules
 * - Config: Form configuration objects
 */

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { BaseFormFieldProps, BaseModalProps, BaseActionProps } from './BaseInterfaces';

// ===== FORM PROPS =====
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

// Generic form dialog actions props
export interface BaseFormDialogActionsProps extends BaseActionProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
}

// ===== FORM DATA & VALIDATION =====
// Generic validation rule data structure
export interface BaseValidationRulesData {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  validate?: (value: any) => boolean | string;
}

// Generic form section data structure
export interface BaseFormSectionData {
  title: string;
  description?: string;
  fields: string[];
  isCollapsible?: boolean;
  isExpanded?: boolean;
}

// ===== FORM CONFIG =====
// Generic form configuration
export interface BaseFormConfig<T extends FieldValues> {
  fields: Partial<Record<keyof T, BaseValidationRulesData>>;
  sections?: BaseFormSectionData[];
  submitButton?: BaseActionProps;
  resetButton?: BaseActionProps;
}

// Legacy exports for backward compatibility
/** @deprecated Use BaseFormDialogActionsProps instead */
export type BaseFormDialogActions = BaseFormDialogActionsProps;
/** @deprecated Use BaseValidationRulesData instead */
export type BaseValidationRules = BaseValidationRulesData;
/** @deprecated Use BaseFormSectionData instead */
export type BaseFormSection = BaseFormSectionData;
