
import { vi } from 'vitest';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

// Create a proper mockUser that satisfies the User type from Supabase
export const mockUser: User = {
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
  
  // Setup auth mock
  vi.mocked(useAuth).mockReturnValue({ user: authUser });
  
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
      insert: vi.fn(),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn()
        }))
      }))
    }))
  }
}));

// Mock auth context
vi.mock('@/contexts/auth', () => ({
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
