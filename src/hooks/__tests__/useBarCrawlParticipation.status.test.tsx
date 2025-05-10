
import { vi, describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { waitFor, renderHook } from '@/test/testing-library-extensions';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';

describe('useBarCrawlParticipation - Status', () => {
  it('should return the correct initial status', () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    expect(result.current.status).toBe('NOT_JOINED');
  });

  it('should update status to "JOINING" when join is called', async () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    result.current.handleJoin();
    expect(result.current.isLoading).toBe(true);
  });

  it('should update status to "LEAVING" when leave is called', async () => {
    const { result } = renderHook(() => useBarCrawlParticipation({ barCrawlId: 'test-crawl' }));
    result.current.handleLeave();
    expect(result.current.isLoading).toBe(true);
  });
});
