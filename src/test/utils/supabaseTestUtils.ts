
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { vi } from 'vitest';

// Mock query builder for Supabase testing
export function createMockQueryBuilder<T>(mockData: T[]): PostgrestFilterBuilder<any, any, T[]> {
  return {
    eq: () => createMockQueryBuilder(mockData),
    neq: () => createMockQueryBuilder(mockData),
    gt: () => createMockQueryBuilder(mockData),
    lt: () => createMockQueryBuilder(mockData),
    gte: () => createMockQueryBuilder(mockData),
    lte: () => createMockQueryBuilder(mockData),
    like: () => createMockQueryBuilder(mockData),
    ilike: () => createMockQueryBuilder(mockData),
    is: () => createMockQueryBuilder(mockData),
    in: () => createMockQueryBuilder(mockData),
    contains: () => createMockQueryBuilder(mockData),
    containedBy: () => createMockQueryBuilder(mockData),
    rangeGt: () => createMockQueryBuilder(mockData),
    rangeGte: () => createMockQueryBuilder(mockData),
    rangeLt: () => createMockQueryBuilder(mockData),
    rangeLte: () => createMockQueryBuilder(mockData),
    rangeAdjacent: () => createMockQueryBuilder(mockData),
    overlaps: () => createMockQueryBuilder(mockData),
    textSearch: () => createMockQueryBuilder(mockData),
    match: () => createMockQueryBuilder(mockData),
    not: () => createMockQueryBuilder(mockData),
    or: () => createMockQueryBuilder(mockData),
    filter: () => createMockQueryBuilder(mockData),
    order: () => createMockQueryBuilder(mockData),
    limit: () => createMockQueryBuilder(mockData),
    range: () => createMockQueryBuilder(mockData),
    single: () => Promise.resolve({ data: mockData[0], error: null }),
    maybeSingle: () => Promise.resolve({ data: mockData[0], error: null }),
    then: (callback) => Promise.resolve(mockData).then(callback),
    select: () => createMockQueryBuilder(mockData),
    returns: () => createMockQueryBuilder(mockData),
    csv: () => Promise.resolve({ data: null, error: null }),
    abortSignal: () => createMockQueryBuilder(mockData),
  } as unknown as PostgrestFilterBuilder<any, any, T[]>;
}

// Creates a mock Supabase client for testing
export function createMockSupabaseClient(mockData = {}) {
  return {
    from: (table: string) => {
      const tableData = mockData[table] || [];
      return {
        select: () => createMockQueryBuilder(tableData),
        insert: (data: any) => Promise.resolve({ data, error: null }),
        update: (data: any) => Promise.resolve({ data, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      };
    },
    rpc: (fn: string, params: any) => {
      return Promise.resolve({ data: [], error: null });
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://test-url.com' } }),
      }),
    },
  };
}

// Spy creation helper for Supabase methods
export function createSupabaseSpy(mockData = {}) {
  const mockClient = createMockSupabaseClient(mockData);
  const spy = {
    from: vi.fn().mockImplementation(mockClient.from),
    rpc: vi.fn().mockImplementation(mockClient.rpc),
    auth: {
      ...mockClient.auth,
      getUser: vi.fn().mockImplementation(mockClient.auth.getUser),
      signOut: vi.fn().mockImplementation(mockClient.auth.signOut),
    },
    storage: {
      from: vi.fn().mockImplementation(() => mockClient.storage.from()),
    },
  };
  
  return spy;
}
