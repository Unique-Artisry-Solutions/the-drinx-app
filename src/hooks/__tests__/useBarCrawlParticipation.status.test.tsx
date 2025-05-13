
import { vi, describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor, renderHook } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '@/hooks/barCrawl/useBarCrawlParticipation';

// Mock the required hooks
vi.mock('@/hooks/barCrawl/useBarCrawlStatus', () => ({
  useBarCrawlStatus: vi.fn().mockReturnValue({
    isCheckingStatus: false,
    isJoined: false,
    error: null
  })
}));

vi.mock('@/hooks/barCrawl/useBarCrawlJoin', () => ({
  useBarCrawlJoin: vi.fn().mockReturnValue({
    isLoading: false,
    error: null,
    handleJoin: vi.fn()
  })
}));

vi.mock('@/hooks/barCrawl/useBarCrawlLeave', () => ({
  useBarCrawlLeave: vi.fn().mockReturnValue({
    isLoading: false,
    error: null,
    handleLeave: vi.fn()
  })
}));

vi.mock('@/contexts/auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

describe('useBarCrawlParticipation - Status', () => {
  it('should return the correct initial status', () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    expect(result.current.isJoined).toBe(false);
  });

  it('should update status to "JOINING" when join is called', async () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    result.current.handleJoin();
    expect(result.current.isLoading).toBe(true);
  });

  it('should update status to "LEAVING" when leave is called', async () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    result.current.handleLeave('test-crawl');
    expect(result.current.isLoading).toBe(true);
  });
});
