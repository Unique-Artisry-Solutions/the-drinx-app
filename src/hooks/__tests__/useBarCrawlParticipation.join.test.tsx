import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import useBarCrawlParticipation from '../useBarCrawlParticipation';

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
      result = useBarCrawlParticipation();
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
    const joinPromise = hookResult.joinBarCrawl(barCrawlId);
    
    // Verify loading state is set
    expect(hookResult.isJoining).toBe(true);
    
    // Wait for the operation to complete
    await waitFor(() => expect(hookResult.isJoining).toBe(false));
    
    // Verify the result
    const result = await joinPromise;
    expect(result.success).toBe(true);
    expect(result.participationId).toBe('test-participation-id');
    
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
    const result = await hookResult.joinBarCrawl('test-crawl-id');
    
    // Verify the error is handled
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to join bar crawl');
    expect(hookResult.isJoining).toBe(false);
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
    const result = await hookResult.joinBarCrawl('test-crawl-id');
    
    // Verify the result
    expect(result.success).toBe(false);
    expect(result.error).toBe('You are already participating in this bar crawl');
    expect(hookResult.isJoining).toBe(false);
  });
  
  it('should handle authentication errors', async () => {
    // Mock authentication error
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Not authenticated' }
    } as any);
    
    // Call the join function
    const result = await hookResult.joinBarCrawl('test-crawl-id');
    
    // Verify the error is handled
    expect(result.success).toBe(false);
    expect(result.error).toBe('You must be logged in to join a bar crawl');
    expect(hookResult.isJoining).toBe(false);
  });
});
