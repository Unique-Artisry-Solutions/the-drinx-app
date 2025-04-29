
import { vi } from 'vitest';

/**
 * Creates a mock query builder for Supabase tests
 */
export function createMockQueryBuilder() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation(callback => Promise.resolve().then(() => callback({ data: [], error: null }))),
    catch: vi.fn(),
    finally: vi.fn(),
  };
}

/**
 * Creates a mock for Supabase authentication
 */
export function createMockAuth() {
  return {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    session: null,
    user: null,
    onAuthStateChange: vi.fn(),
  };
}

/**
 * Creates a mock for Supabase storage
 */
export function createMockStorage() {
  return {
    from: vi.fn().mockReturnValue({
      upload: vi.fn(),
      download: vi.fn(),
      getPublicUrl: vi.fn(),
      list: vi.fn(),
      remove: vi.fn(),
    }),
  };
}

/**
 * Helper to mock a successful database response
 * @param data The data to return
 */
export function mockSuccessResponse(data: any) {
  return { data, error: null };
}

/**
 * Helper to mock a failed database response
 * @param message Error message
 * @param code Optional error code
 */
export function mockErrorResponse(message: string, code = 'unknown_error') {
  return { 
    data: null, 
    error: { 
      message, 
      code,
      details: '',
      hint: ''
    } 
  };
}

/**
 * Creates a complete mock Supabase client for testing
 */
export function createMockSupabase() {
  return {
    from: vi.fn(() => createMockQueryBuilder()),
    rpc: vi.fn(),
    auth: createMockAuth(),
    storage: createMockStorage(),
  };
}

/**
 * Helper to mock RLS policies for testing
 */
export function mockRlsPolicies() {
  return {
    enableRls: vi.fn(),
    disableRls: vi.fn(),
  };
}
