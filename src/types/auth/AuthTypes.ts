
/**
 * Authentication related types
 */

export type AuthMode = 'login' | 'signup' | 'verify' | 'reset';

export type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
  user_type?: UserType;
  name?: string;
};

export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export type ValidDays = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type UserSegmentType = 'all' | 'new' | 'returning';

export type ValidHours = {
  start: string;
  end: string;
};

export type AuthState = 'idle' | 'loading' | 'success' | 'error';
