
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabase } from '@/lib/supabase';

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
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup the hook
    function TestComponent() {
      hookResult = useBarCrawlParticipation({ barCrawlId: mockBarCrawlId });
      return null;
    }
    render(<TestComponent />);
  });
  
  it('should successfully leave a bar crawl', async () => {
    // Call leave function
    hookResult.handleLeave();
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify supabase was called correctly
    expect(supabase.from).toHaveBeenCalledWith('user_bar_crawl_participation');
    expect(supabase.from().delete).toHaveBeenCalled();
  });
  
  it('should handle errors when leaving a bar crawl', async () => {
    // Mock an error response
    vi.mocked(supabase.from().delete().eq().eq).mockResolvedValueOnce({
      data: null,
      error: { message: 'Failed to leave bar crawl' },
    } as any);
    
    // Call leave function
    hookResult.handleLeave();
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify error is handled
    expect(hookResult.error).toBeTruthy();
  });
  
  it('should handle authentication errors', async () => {
    // Mock auth error
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Not authenticated' },
    } as any);
    
    // Call leave function
    hookResult.handleLeave();
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify error is handled
    expect(hookResult.error).toBeTruthy();
  });
});
