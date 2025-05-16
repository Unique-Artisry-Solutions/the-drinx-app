
// Auth Types
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export type ValidDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type UserSegmentType = 'all' | 'new' | 'loyal' | 'inactive' | 'vip' | 'birthday';

export interface AuthUser {
  id: string;
  email: string;
  userType?: UserType;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  verified?: boolean;
  preferences?: Record<string, any>;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  userType: UserType;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptTerms: boolean;
}

// Add the missing AccessLevel type
export type AccessLevel = 'public' | 'authenticated' | 'admin';
