
import { User, Session } from '@supabase/supabase-js';
import { UserType } from '@/types/navigation';

const createMockUser = (userType: UserType, id: string): User => ({
  id,
  email: `${userType}@spiritless.com`,
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_metadata: {
    user_type: userType,
    username: `test${userType}`,
    display_name: `Test ${userType.charAt(0).toUpperCase() + userType.slice(1)}`
  },
  app_metadata: {},
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  phone: '+1234567890',
  role: 'authenticated'
} as User);

const createMockSession = (user: User): Session => ({
  access_token: `dev-access-token-${user.user_metadata?.user_type}`,
  refresh_token: `dev-refresh-token-${user.user_metadata?.user_type}`,
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user
} as Session);

export class DevAuthService {
  static shouldBypassAuth(
    isDevelopment: boolean,
    isDevModeActive: boolean,
    devUserType: UserType | null
  ): boolean {
    return isDevelopment && isDevModeActive && devUserType !== null;
  }

  static getEffectiveAuthState(
    authUser: User | null,
    authSession: Session | null,
    authIsAuthenticated: boolean,
    isDevelopment: boolean,
    isDevModeActive: boolean,
    devUserType: UserType | null
  ) {
    if (this.shouldBypassAuth(isDevelopment, isDevModeActive, devUserType)) {
      const mockUser = createMockUser(devUserType!, `dev-${devUserType}-001`);
      const mockSession = createMockSession(mockUser);
      
      return {
        user: mockUser,
        session: mockSession,
        isAuthenticated: true,
        userType: devUserType
      };
    }

    return {
      user: authUser,
      session: authSession,
      isAuthenticated: authIsAuthenticated,
      userType: authUser?.user_metadata?.user_type || null
    };
  }

  static getMockProfile(userType: UserType) {
    const mockUser = createMockUser(userType, `dev-${userType}-001`);
    return {
      id: mockUser.id,
      email: mockUser.email,
      username: mockUser.user_metadata?.username,
      display_name: mockUser.user_metadata?.display_name,
      user_type: userType,
      avatar_url: null,
      bio: `Mock ${userType} user for development testing`,
      phone: mockUser.phone,
      created_at: mockUser.created_at,
      updated_at: mockUser.updated_at,
      email_notifications: true,
      push_notifications: false
    };
  }
}
