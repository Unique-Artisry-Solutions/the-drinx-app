
/**
 * Auth component types using shared base interfaces with consistent naming conventions
 * 
 * Namespace: Auth
 * Naming Conventions Applied:
 * - Props: Component interfaces
 * - Data: Data structures for forms and API
 * - Config: Configuration objects
 */

import { BaseModalProps } from '@/types/shared/BaseInterfaces';

// ===== AUTH DATA STRUCTURES =====
// Shared auth form data interface
export interface BaseAuthFormData {
  email: string;
  password: string;
}

// Specific form data extending base
export interface SignupFormData extends BaseAuthFormData {
  name: string;
  confirmPassword: string;
  userType: 'individual' | 'establishment' | 'promoter';
  phone?: string;
  agreeToTerms: boolean;
}

export interface LoginFormData extends BaseAuthFormData {
  rememberMe?: boolean;
}

// ===== AUTH COMPONENT PROPS =====
// Enhanced user auth props using shared interfaces
export interface UserAuthProps extends Partial<BaseModalProps> {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

// Auth form component props
export interface AuthFormProps<T extends BaseAuthFormData> {
  onSubmit: (data: T) => Promise<void>;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  showUserTypeSelector?: boolean;
  isLoading?: boolean;
}

// ===== SPECIFIC FORM PROPS =====
// Specific form props with proper typing
export type LoginFormProps = AuthFormProps<LoginFormData>;
export type SignupFormProps = AuthFormProps<SignupFormData>;
