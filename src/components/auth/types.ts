
// Updated auth types using shared base interfaces
import { BaseModalProps, BaseFormProps } from '@/types/shared/BaseInterfaces';
import { BaseFormDialogActions } from '@/types/shared/FormInterfaces';

// Shared auth form data interface
export interface BaseAuthFormData {
  email: string;
  password: string;
}

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

// Enhanced user auth props using shared interfaces
export interface UserAuthProps extends Partial<BaseModalProps> {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

// Auth form component props using generic form interface
export interface AuthFormProps<T extends BaseAuthFormData> extends BaseFormProps<T>, BaseFormDialogActions {
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  showUserTypeSelector?: boolean;
}

// Specific form props
export type LoginFormProps = AuthFormProps<LoginFormData>;
export type SignupFormProps = AuthFormProps<SignupFormData>;
