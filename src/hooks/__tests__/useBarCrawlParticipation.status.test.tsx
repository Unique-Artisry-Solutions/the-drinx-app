
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabaseClient } from '@/lib/supabaseClient';
import { setupMocks, mockUser, getLocalStorageMock } from './utils/barCrawlParticipationTestUtils';

const localStorageMock = getLocalStorageMock();

describe('useBarCrawlParticipation - Initial Status Check', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('should check the participation status on mount for a real bar crawl ID', async () => {
    // Setup mock for select query
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: { id: 'participation-1' },
      error: null
    });
    (supabaseClient.from().select().eq().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123e4567-e89b-12d3-a456-426614174000' })
    );

    // Initially loading
    expect(result.current.isCheckingStatus).toBe(true);
    
    // Wait for the check to complete
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(true);
    expect(supabaseClient.from).toHaveBeenCalledWith('user_bar_crawl_participation');
  });
  
  it('should check the participation status for a sample bar crawl ID using localStorage', async () => {
    // Setup localStorage with sample participation
    localStorageMock.setItem('user_bar_crawl_participations', JSON.stringify([
      { bar_crawl_id: 'bc-123', user_id: mockUser.id }
    ]));
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: 'bc-123' })
    );
    
    // Wait for the check to complete
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(true);
    expect(supabaseClient.from).not.toHaveBeenCalled();
  });
  
  it('should handle numeric bar crawl IDs with admin bypass', async () => {
    // Setup localStorage with admin bypass and participation
    localStorageMock.setItem('admin_bypass', 'true');
    localStorageMock.setItem('user_bar_crawl_participations', JSON.stringify([
      { bar_crawl_id: '123', user_id: mockUser.id }
    ]));
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123' })
    );
    
    // Wait for the check to complete
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(true);
    expect(supabaseClient.from).not.toHaveBeenCalled();
  });
  
  it('should set error for invalid UUIDs without admin bypass', async () => {
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123' })
    );
    
    // Wait for the check to complete
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('Invalid bar crawl ID format');
  });
});
