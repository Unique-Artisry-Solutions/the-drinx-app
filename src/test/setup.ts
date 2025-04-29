
import { expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Setup global mocks
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(),
      then: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Make sure we're using Jest's expect matchers
global.expect = expect;
