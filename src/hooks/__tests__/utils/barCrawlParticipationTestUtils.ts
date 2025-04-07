
import { vi } from 'vitest';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

// Common mock user
export const mockUser = { id: 'test-user-id' };
export const mockToast = { toast: vi.fn() };

// Setup mock dependencies for tests
export function setupMocks(authUser = mockUser) {
  vi.clearAllMocks();
  
  // Clear localStorage mock
  getLocalStorageMock().clear();
  
  // Setup auth mock
  (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: authUser });
  
  // Setup toast mock
  (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockToast);
}

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabaseClient: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
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
