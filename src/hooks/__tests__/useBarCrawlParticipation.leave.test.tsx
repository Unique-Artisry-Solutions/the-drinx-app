import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useBarCrawlParticipation from '../useBarCrawlParticipation';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
    },
  },
}));

describe('useBarCrawlParticipation - leave functionality', () => {
  const mockBarCrawlId = 'test-crawl-id';
  let leaveBarCrawl: ReturnType<typeof useBarCrawlParticipation>['leaveBarCrawl'];
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup the hook
    const { result } = renderHook(() => useBarCrawlParticipation());
    leaveBarCrawl = result.current.leaveBarCrawl;
  });
  
  it('should successfully leave a bar crawl', async () => {
    const { success, error } = await leaveBarCrawl(mockBarCrawlId);
    
    expect(success).toBe(true);
    expect(error).toBeNull();
    
    // Verify supabase was called correctly
    expect(supabase.from).toHaveBeenCalledWith('bar_crawl_participants');
    expect(supabase.from().delete).toHaveBeenCalled();
    expect(supabase.from().delete().eq).toHaveBeenCalledWith('user_id', 'test-user-id');
    expect(supabase.from().delete().eq().eq).toHaveBeenCalledWith('bar_crawl_id', mockBarCrawlId);
  });
  
  it('should handle errors when leaving a bar crawl', async () => {
    // Mock an error response
    vi.mocked(supabase.from().delete().eq().eq).mockResolvedValueOnce({
      data: null,
      error: { message: 'Failed to leave bar crawl' },
    } as any);
    
    const { success, error } = await leaveBarCrawl(mockBarCrawlId);
    
    expect(success).toBe(false);
    expect(error).toBe('Failed to leave bar crawl');
  });
  
  it('should handle authentication errors', async () => {
    // Mock auth error
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Not authenticated' },
    } as any);
    
    const { success, error } = await leaveBarCrawl(mockBarCrawlId);
    
    expect(success).toBe(false);
    expect(error).toBe('You must be logged in to leave a bar crawl');
  });
  
  it('should handle missing user data', async () => {
    // Mock missing user
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: null,
    } as any);
    
    const { success, error } = await leaveBarCrawl(mockBarCrawlId);
    
    expect(success).toBe(false);
    expect(error).toBe('You must be logged in to leave a bar crawl');
  });
});

// Helper function to simulate renderHook since we're using our own implementation
function renderHook<Result>(hook: () => Result) {
  const result = { current: hook() };
  return { result };
}
