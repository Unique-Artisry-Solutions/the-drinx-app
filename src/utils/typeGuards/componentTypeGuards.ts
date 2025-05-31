
/**
 * Type guards specific to component props and state validation
 */

import { ReactNode } from 'react';
import { 
  BaseComponentProps, 
  BaseCardProps, 
  BaseFormFieldProps,
  BaseNavItemProps,
  BaseModalProps,
  BaseActionProps 
} from '@/types/shared/BaseInterfaces';
import { isString, isBoolean, isObject, isNumber } from './coreTypeGuards';

// ===== COMPONENT PROPS TYPE GUARDS =====
export const isBaseComponentProps = (value: unknown): value is BaseComponentProps => {
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  // All properties are optional
  if ('className' in props && props.className !== undefined && !isString(props.className)) return false;
  if ('id' in props && props.id !== undefined && !isString(props.id)) return false;
  if ('children' in props && props.children !== undefined) {
    // ReactNode can be string, number, boolean, null, undefined, or React elements
    const { children } = props;
    if (children !== null && children !== undefined && 
        !isString(children) && !isNumber(children) && !isBoolean(children) &&
        !isObject(children)) {
      return false;
    }
  }
  
  return true;
};

export const isBaseCardProps = (value: unknown): value is BaseCardProps => {
  if (!isBaseComponentProps(value)) return false;
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  if ('title' in props && props.title !== undefined && !isString(props.title)) return false;
  if ('description' in props && props.description !== undefined && !isString(props.description)) return false;
  if ('imageUrl' in props && props.imageUrl !== undefined && !isString(props.imageUrl)) return false;
  if ('onClick' in props && props.onClick !== undefined && typeof props.onClick !== 'function') return false;
  if ('isSelected' in props && props.isSelected !== undefined && !isBoolean(props.isSelected)) return false;
  if ('isDisabled' in props && props.isDisabled !== undefined && !isBoolean(props.isDisabled)) return false;
  
  return true;
};

export const isBaseFormFieldProps = (value: unknown): value is BaseFormFieldProps => {
  if (!isBaseComponentProps(value)) return false;
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  if ('label' in props && props.label !== undefined && !isString(props.label)) return false;
  if ('placeholder' in props && props.placeholder !== undefined && !isString(props.placeholder)) return false;
  if ('required' in props && props.required !== undefined && !isBoolean(props.required)) return false;
  if ('disabled' in props && props.disabled !== undefined && !isBoolean(props.disabled)) return false;
  if ('error' in props && props.error !== undefined && !isString(props.error)) return false;
  if ('helpText' in props && props.helpText !== undefined && !isString(props.helpText)) return false;
  
  return true;
};

export const isBaseNavItemProps = (value: unknown): value is BaseNavItemProps => {
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  // Required fields
  if (!isString(props.id) || !isString(props.label) || !isString(props.path)) return false;
  
  // Optional fields
  if ('icon' in props && props.icon !== undefined && typeof props.icon !== 'function') return false;
  if ('isActive' in props && props.isActive !== undefined && !isBoolean(props.isActive)) return false;
  if ('badge' in props && props.badge !== undefined && !isString(props.badge) && !isNumber(props.badge)) return false;
  if ('onClick' in props && props.onClick !== undefined && typeof props.onClick !== 'function') return false;
  
  return true;
};

export const isBaseModalProps = (value: unknown): value is BaseModalProps => {
  if (!isBaseComponentProps(value)) return false;
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  // Required fields
  if (!isBoolean(props.isOpen) || typeof props.onClose !== 'function') return false;
  
  // Optional fields
  if ('title' in props && props.title !== undefined && !isString(props.title)) return false;
  if ('size' in props && props.size !== undefined) {
    const validSizes = ['sm', 'md', 'lg', 'xl'];
    if (!isString(props.size) || !validSizes.includes(props.size)) return false;
  }
  if ('showCloseButton' in props && props.showCloseButton !== undefined && !isBoolean(props.showCloseButton)) return false;
  
  return true;
};

export const isBaseActionProps = (value: unknown): value is BaseActionProps => {
  if (!isBaseComponentProps(value)) return false;
  if (!isObject(value)) return false;
  
  const props = value as Record<string, unknown>;
  
  // All fields are optional
  if ('variant' in props && props.variant !== undefined) {
    const validVariants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
    if (!isString(props.variant) || !validVariants.includes(props.variant)) return false;
  }
  if ('size' in props && props.size !== undefined) {
    const validSizes = ['sm', 'md', 'lg'];
    if (!isString(props.size) || !validSizes.includes(props.size)) return false;
  }
  if ('isLoading' in props && props.isLoading !== undefined && !isBoolean(props.isLoading)) return false;
  if ('disabled' in props && props.disabled !== undefined && !isBoolean(props.disabled)) return false;
  if ('icon' in props && props.icon !== undefined && typeof props.icon !== 'function') return false;
  if ('onClick' in props && props.onClick !== undefined && typeof props.onClick !== 'function') return false;
  
  return true;
};

// ===== VALIDATION UTILITIES =====
export const validateComponentProps = <T>(
  props: unknown,
  guard: (value: unknown) => value is T,
  componentName: string
): T => {
  if (!guard(props)) {
    console.error(`Invalid props for ${componentName}:`, props);
    throw new Error(`Invalid props provided to ${componentName} component`);
  }
  return props;
};

// ===== SAFE PROP EXTRACTORS =====
export const extractSafeProps = <T extends BaseComponentProps>(
  props: unknown,
  defaultProps: T
): T => {
  if (!isBaseComponentProps(props)) {
    console.warn('Invalid component props, using defaults:', props);
    return defaultProps;
  }
  
  return { ...defaultProps, ...props } as T;
};
