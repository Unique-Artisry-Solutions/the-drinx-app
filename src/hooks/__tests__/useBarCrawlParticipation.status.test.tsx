
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

describe('useBarCrawlParticipation - Status', () => {
  const mockBarCrawlId = 'test-crawl';
  let hookResult: ReturnType<typeof useBarCrawlParticipation>;
  let mockRepo: ReturnType<typeof setupMockBarCrawlRepositories>['mockBarCrawlParticipationRepo'];
  
  beforeEach(() => {
    const mocks = setupMockBarCrawlRepositories();
    mockRepo = mocks.mockBarCrawlParticipationRepo;
  });
  
  afterEach(() => {
    cleanupMockBarCrawlRepositories();
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
  
  it('should return the correct initial status', () => {
    // Setup the mock to return false for isUserParticipating
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(false);
    
    // Render the hook
    hookResult = renderHook();
    
    // Wait for the status check to complete
    waitFor(() => expect(hookResult.isCheckingStatus).toBe(false));
    
    // Verify the hook returns the correct status
    expect(hookResult.isJoined).toBe(false);
  });

  it('should update status when join is called', async () => {
    // Setup mocks
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(false);
    mockRepo.joinBarCrawl = vi.fn().mockResolvedValue({ id: 'new-participation', user_id: 'test-user-id', bar_crawl_id: mockBarCrawlId });
    
    // After join, isUserParticipating should return true
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(true);
    
    // Render the hook
    hookResult = renderHook();
    
    // Call join
    hookResult.handleJoin();
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify join was called
    expect(mockRepo.joinBarCrawl).toHaveBeenCalled();
  });

  it('should update status when leave is called', async () => {
    // Setup mocks
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(true);
    mockRepo.leaveBarCrawl = vi.fn().mockResolvedValue(true);
    
    // After leave, isUserParticipating should return false
    mockRepo.isUserParticipating = vi.fn().mockResolvedValue(false);
    
    // Render the hook
    hookResult = renderHook();
    
    // Call leave
    hookResult.handleLeave(mockBarCrawlId);
    
    // Verify loading state is set
    expect(hookResult.isLoading).toBe(true);
    
    // Wait for operation to complete
    await waitFor(() => expect(hookResult.isLoading).toBe(false));
    
    // Verify leave was called
    expect(mockRepo.leaveBarCrawl).toHaveBeenCalled();
  });
});
