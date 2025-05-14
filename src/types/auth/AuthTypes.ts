
export type UserType = 'individual' | 'establishment' | 'admin' | 'promoter';

export type ValidDays = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type UserSegmentType = 'new' | 'returning' | 'all';

export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  user_type: UserType;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends AuthFormData {
  username: string;
  userType: UserType;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}
