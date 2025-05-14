
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

describe('useBarCrawlParticipation - Leave Functionality', () => {
  const mockBarCrawlId = 'test-crawl-id';
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  let mockRepo: ReturnType<typeof setupMockBarCrawlRepositories>['mockBarCrawlParticipationRepo'];
  
  beforeEach(() => {
    const mocks = setupMockBarCrawlRepositories();
    mockRepo = mocks.mockBarCrawlParticipationRepo;
    
    // Setup default mock behavior
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(true);
    mockRepo.leaveBarCrawl = vi.fn().mockResolvedValue(true);
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
    
    // Verify leave was called correctly
    expect(mockRepo.leaveBarCrawl).toHaveBeenCalledWith('test-user-id', mockBarCrawlId);
  });
  
  it('should handle errors when leaving fails', async () => {
    // Setup the mock to throw an error
    mockRepo.leaveBarCrawl = vi.fn().mockRejectedValue(new Error('Failed to leave bar crawl'));
    
    // Render the hook
    hookResult = renderHook();
    
    // Wait for status check to complete
    await waitFor(() => expect(hookResult.isCheckingStatus).toBe(false));
    
    // Call leave
    hookResult.handleLeave(mockBarCrawlId);
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify error state is set
    expect(hookResult.error).toBeTruthy();
  });
});
