
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '@/hooks/barCrawl/useBarCrawlParticipation';

// Mock the auth context
vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock Supabase
const mockInsert = vi.fn().mockResolvedValue({ error: null });
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: null })
          }))
        }))
      })),
      insert: mockInsert
    }))
  }
}));

describe('useBarCrawlParticipation - Join Functionality', () => {
  const mockBarCrawlId = 'test-crawl-id';
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock reload
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true
    });
  });

  const renderHook = () => {
    let result: any;
    
    function TestComponent() {
      result = useBarCrawlParticipation({ barCrawlId: mockBarCrawlId });
      return null;
    }
    
    render(<TestComponent />);
    return result;
  };
  
  it('should join a bar crawl successfully', async () => {
    // Render the hook
    hookResult = renderHook();
    
    // Wait for status check to complete
    await waitFor(() => expect(hookResult.isCheckingStatus).toBe(false));
    
    // Call join
    hookResult.handleJoin();
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify insert was called correctly
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'test-user-id',
      bar_crawl_id: mockBarCrawlId,
      joined_at: expect.any(String)
    });
  });
});
