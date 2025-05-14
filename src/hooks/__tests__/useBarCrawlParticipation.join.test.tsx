
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '@/hooks/barCrawl/useBarCrawlParticipation';
import { setupMockBarCrawlRepositories, cleanupMockBarCrawlRepositories } from '@/test/utils/barCrawlRepositoryTestUtils';

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

describe('useBarCrawlParticipation - Join Functionality', () => {
  const mockBarCrawlId = 'test-crawl-id';
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  let mockRepo: ReturnType<typeof setupMockBarCrawlRepositories>['mockBarCrawlParticipationRepo'];
  
  beforeEach(() => {
    const mocks = setupMockBarCrawlRepositories();
    mockRepo = mocks.mockBarCrawlParticipationRepo;
    
    // Setup default mock behavior
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(false);
    mockRepo.joinBarCrawl = vi.fn().mockResolvedValue({
      id: 'test-participation-id',
      user_id: 'test-user-id',
      bar_crawl_id: mockBarCrawlId,
      joined_at: new Date().toISOString()
    });
  });
  
  afterEach(() => {
    cleanupMockBarCrawlRepositories();
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
    
    // Verify join was called correctly
    expect(mockRepo.joinBarCrawl).toHaveBeenCalledWith('test-user-id', mockBarCrawlId);
  });
  
  it('should handle errors when joining fails', async () => {
    // Setup the mock to throw an error
    mockRepo.joinBarCrawl = vi.fn().mockRejectedValue(new Error('Failed to join bar crawl'));
    
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
    
    // Verify error state is set
    expect(hookResult.error).toBeTruthy();
  });
});
