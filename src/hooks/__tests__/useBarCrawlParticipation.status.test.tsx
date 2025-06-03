
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
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: null })
          }))
        }))
      }))
    }))
  }
}));

describe('useBarCrawlParticipation - Status', () => {
  const mockBarCrawlId = 'test-crawl';
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  
  beforeEach(() => {
    vi.clearAllMocks();
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
  
  it('should return the correct initial status', async () => {
    // Render the hook
    hookResult = renderHook();
    
    // Wait for the status check to complete
    await waitFor(() => expect(hookResult.isCheckingStatus).toBe(false));
    
    // Verify the hook returns the correct status
    expect(hookResult.isJoined).toBe(false);
  });
});
