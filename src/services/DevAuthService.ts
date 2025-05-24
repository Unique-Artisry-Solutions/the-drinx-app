
import { User, Session } from '@supabase/supabase-js';
import { UserType } from '@/types/navigation';

/**
 * Mock user data for different user types in development mode
 */
export const DEV_MOCK_USERS: Record<UserType, { user: User; session: Session }> = {
  individual: {
    user: {
      id: 'dev-individual-001',
      email: 'individual@spiritless.com',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        user_type: 'individual',
        username: 'testuser',
        display_name: 'Test Individual'
      },
      app_metadata: {},
      aud: 'authenticated',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      phone: '+1234567890',
      role: 'authenticated'
    } as User,
    session: {
      access_token: 'dev-access-token-individual',
      refresh_token: 'dev-refresh-token-individual',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {} as User // Will be filled by reference
    } as Session
  },
  establishment: {
    user: {
      id: 'dev-establishment-001',
      email: 'establishment@spiritless.com',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        user_type: 'establishment',
        username: 'testbar',
        display_name: 'Test Bar & Grill'
      },
      app_metadata: {},
      aud: 'authenticated',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      phone: '+1234567891',
      role: 'authenticated'
    } as User,
    session: {
      access_token: 'dev-access-token-establishment',
      refresh_token: 'dev-refresh-token-establishment',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {} as User
    } as Session
  },
  promoter: {
    user: {
      id: 'dev-promoter-001',
      email: 'promoter@spiritless.com',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        user_type: 'promoter',
        username: 'testpromoter',
        display_name: 'Test Event Promoter'
      },
      app_metadata: {},
      aud: 'authenticated',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      phone: '+1234567892',
      role: 'authenticated'
    } as User,
    session: {
      access_token: 'dev-access-token-promoter',
      refresh_token: 'dev-refresh-token-promoter',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {} as User
    } as Session
  },
  admin: {
    user: {
      id: 'dev-admin-001',
      email: 'admin@spiritless.com',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_metadata: {
        user_type: 'admin',
        username: 'admin',
        display_name: 'System Administrator'
      },
      app_metadata: {},
      aud: 'authenticated',
      confirmation_sent_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      phone: '+1234567893',
      role: 'authenticated'
    } as User,
    session: {
      access_token: 'dev-access-token-admin',
      refresh_token: 'dev-refresh-token-admin',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {} as User
    } as Session
  }
};

// Set up circular references
Object.keys(DEV_MOCK_USERS).forEach(userType => {
  const data = DEV_MOCK_USERS[userType as UserType];
  data.session.user = data.user;
});

/**
 * Development Authentication Bypass Service
 * Provides mock authentication state and user data for development mode
 */
export class DevAuthService {
  /**
   * Get mock user data for a specific user type
   */
  static getMockUser(userType: UserType): User {
    return DEV_MOCK_USERS[userType].user;
  }

  /**
   * Get mock session data for a specific user type
   */
  static getMockSession(userType: UserType): Session {
    return DEV_MOCK_USERS[userType].session;
  }

  /**
   * Check if dev mode should bypass authentication
   */
  static shouldBypassAuth(
    isDevelopment: boolean,
    isDevModeActive: boolean,
    devUserType: UserType | null
  ): boolean {
    return isDevelopment && isDevModeActive && devUserType !== null;
  }

  /**
   * Get effective authentication state for components
   */
  static getEffectiveAuthState(
    authUser: User | null,
    authSession: Session | null,
    authIsAuthenticated: boolean,
    isDevelopment: boolean,
    isDevModeActive: boolean,
    devUserType: UserType | null
  ) {
    if (this.shouldBypassAuth(isDevelopment, isDevModeActive, devUserType)) {
      const mockData = DEV_MOCK_USERS[devUserType!];
      return {
        user: mockData.user,
        session: mockData.session,
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

  /**
   * Create mock profile data for dev mode
   */
  static getMockProfile(userType: UserType) {
    const mockUser = this.getMockUser(userType);
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
