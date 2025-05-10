
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabase } from '@/lib/supabase';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        data: [{ id: 'test-participation-id' }],
        error: null
      }),
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null
            })
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
    hookResult.handleJoin();
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for the operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify Supabase was called correctly
    expect(supabase.from).toHaveBeenCalledWith('user_bar_crawl_participation');
  });
});
