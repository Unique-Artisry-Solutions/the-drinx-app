
import { vi } from 'vitest';

// Using 'any' type here since PostgrestQueryBuilder isn't directly exported
export function createMockQueryBuilder() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    url: '',
    headers: {},
  } as unknown as any;
}

export const mockSupabaseResponse = {
  data: null,
  error: null,
};
