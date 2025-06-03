
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
const mockDelete = vi.fn(() => ({
  eq: vi.fn(() => ({
    eq: vi.fn().mockResolvedValue({ error: null })
  }))
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: { id: 'test' }, error: null })
          }))
        }))
      })),
      delete: mockDelete
    }))
  }
}));

describe('useBarCrawlParticipation - Leave Functionality', () => {
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
  
  it('should leave a bar crawl successfully', async () => {
    // Render the hook
    hookResult = renderHook();
    
    // Wait for status check to complete
    await waitFor(() => expect(hookResult.isCheckingStatus).toBe(false));
    
    // Call leave with the required barCrawlId parameter
    hookResult.handleLeave(mockBarCrawlId);
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify delete was called correctly
    expect(mockDelete).toHaveBeenCalled();
  });
});
