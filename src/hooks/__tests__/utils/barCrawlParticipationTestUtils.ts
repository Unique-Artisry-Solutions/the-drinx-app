
import { vi } from 'vitest';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/contexts/auth/types';

// Create a proper mockUser that satisfies the User type from Supabase
export const mockUser = {
  id: 'test-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email: 'test@example.com',
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: '',
  factors: null
};

// Create a proper mock toast that satisfies the useToast return type
export const mockToast = { 
  toast: vi.fn(),
  dismiss: vi.fn(),
  toasts: []
};

// Setup mock dependencies for tests
export function setupMocks(authUser = mockUser) {
  vi.clearAllMocks();
  
  // Clear localStorage mock
  getLocalStorageMock().clear();
  
  // Create a complete mock auth context with proper typing
  const mockAuthContext: AuthContextType = {
    user: authUser,
    session: authUser ? { 
      user: authUser,
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_at: Date.now() + 3600,
      expires_in: 3600,
      provider_token: null,
      provider_refresh_token: null,
      token_type: 'bearer'
    } : null,
    isAuthenticated: !!authUser,
    isLoading: false,
    isEmailVerified: true,
    authStable: true,
    authError: null,
    isVerificationEmailSent: false,
    userType: 'individual' as const, // Use 'as const' to ensure literal type
    signIn: vi.fn().mockResolvedValue({ error: null, data: {} }),
    signUp: vi.fn().mockResolvedValue({}),
    signOut: vi.fn().mockResolvedValue({}),
    updateUserProfile: vi.fn().mockResolvedValue({}),
    refreshSession: vi.fn().mockResolvedValue({ isEmailVerified: true }),
    updatePassword: vi.fn().mockResolvedValue({}),
    recoverAuthState: vi.fn().mockResolvedValue(true),
    sendVerificationEmail: vi.fn().mockResolvedValue({})
  };
  
  // Setup auth mock with the complete context
  vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  
  // Setup toast mock
  vi.mocked(useToast).mockReturnValue(mockToast);
}

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabaseClient: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn()
          }))
        }))
      })),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
      }))
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: mockUser },
        error: null
      })
    }
  }
}));

// Mock auth context
vi.mock('@/contexts/auth/AuthProvider', () => ({
  useAuth: vi.fn()
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

// Create localStorage mock
export function getLocalStorageMock() {
  const store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    getAll: () => store
  };
}

// Setup localStorage mock
const localStorageMock = getLocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper to mock Supabase responses
export function mockSupabaseQuery(mockData: any, mockError: any = null) {
  return {
    data: mockData,
    error: mockError
  };
}
