
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabase } from '@/lib/supabase';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 'test-participation-id' }],
          error: null
        })
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      })
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      })
    }
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useBarCrawlParticipation - join functionality', () => {
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  
  const renderHook = () => {
    let result: any;
    
    function TestComponent() {
      result = useBarCrawlParticipation({ barCrawlId: 'test-crawl-id' });
      return null;
    }
    
    render(<TestComponent />);
    return result;
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    hookResult = renderHook();
  });
  
  it('should join a bar crawl successfully', async () => {
    const barCrawlId = 'test-crawl-id';
    
    // Call the join function
    const joinPromise = hookResult.handleJoin();
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for the operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify Supabase was called correctly
    expect(vi.mocked(supabase.from).mock.calls[0][0]).toBe('bar_crawl_participants');
    expect(vi.mocked(supabase.from)().insert).toHaveBeenCalledWith({
      user_id: 'test-user-id',
      bar_crawl_id: barCrawlId,
      joined_at: expect.any(String)
    });
  });
  
  it('should handle errors when joining a bar crawl', async () => {
    // Mock an error response
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Failed to join bar crawl' }
        })
      })
    } as any);
    
    // Call the join function
    await hookResult.handleJoin();
    
    // Verify the error is handled
    expect(hookResult.error).toBeTruthy();
    expect(hookResult.isLoading).toBe(false);
  });
  
  it('should prevent joining if user is already a participant', async () => {
    // Mock that user is already a participant
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'existing-participation' },
            error: null
          })
        })
      })
    } as any);
    
    // Call the join function
    await hookResult.handleJoin();
    
    // Verify the error is handled
    expect(hookResult.error).toBeTruthy();
    expect(hookResult.isLoading).toBe(false);
  });
  
  it('should handle authentication errors', async () => {
    // Mock authentication error
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Not authenticated' }
    } as any);
    
    // Call the join function
    await hookResult.handleJoin();
    
    // Verify the error is handled
    expect(hookResult.error).toBeTruthy();
    expect(hookResult.isLoading).toBe(false);
  });
});
