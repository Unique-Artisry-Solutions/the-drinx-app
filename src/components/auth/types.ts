
import { BaseModalProps } from '@/types/shared/BaseInterfaces';

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

export interface UserAuthProps extends Partial<BaseModalProps> {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

export interface AuthFormProps<T extends BaseAuthFormData> {
  onSubmit: (data: T) => Promise<void> | void;
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
  showUserTypeSelector?: boolean;
}

export type LoginFormProps = AuthFormProps<LoginFormData>;
export type SignupFormProps = AuthFormProps<SignupFormData>;
