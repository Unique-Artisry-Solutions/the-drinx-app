
import { vi } from 'vitest';
import { PostgrestQueryBuilder } from '@supabase/supabase-js';

export function createMockQueryBuilder() {
  return {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    url: '',
    headers: {},
  } as unknown as PostgrestQueryBuilder<any, any, any>;
}

export const mockSupabaseResponse = {
  data: null,
  error: null,
};

