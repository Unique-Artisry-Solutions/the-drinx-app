
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabaseClient } from '@/lib/supabaseClient';
import { setupMocks, mockToast, getLocalStorageMock } from './utils/barCrawlParticipationTestUtils';

const localStorageMock = getLocalStorageMock();

describe('useBarCrawlParticipation - Leave Functionality', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('should handle leaving a real bar crawl with valid UUID', async () => {
    // Setup mock for delete query
    const mockDelete = vi.fn().mockResolvedValue({
      data: { id: 'deleted-participation' },
      error: null
    });
    (supabaseClient.from().delete().eq().eq as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockDelete);
    
    // Setup initial state as joined
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: { id: 'participation-1' },
      error: null
    });
    (supabaseClient.from().select().eq().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123e4567-e89b-12d3-a456-426614174000' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
      expect(result.current.isJoined).toBe(true);
    });
    
    // Act - leave the bar crawl
    act(() => {
      result.current.handleLeave();
    });
    
    // Wait for leave to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(false);
    expect(mockToast.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Left Swig Circuit'
      })
    );
  });
  
  it('should handle leaving a sample bar crawl using localStorage', async () => {
    // Setup localStorage with sample participation
    localStorageMock.setItem('user_bar_crawl_participations', JSON.stringify([
      { bar_crawl_id: 'bc-789', user_id: 'test-user-id' }
    ]));
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: 'bc-789' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
      expect(result.current.isJoined).toBe(true);
    });
    
    // Act - leave the bar crawl
    act(() => {
      result.current.handleLeave();
    });
    
    // Wait for leave to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(false);
    
    // Verify localStorage was updated
    const storedData = JSON.parse(localStorageMock.getItem('user_bar_crawl_participations') || '[]');
    expect(storedData.some((p: any) => p.bar_crawl_id === 'bc-789')).toBe(false);
  });
  
  it('should handle leave errors from Supabase', async () => {
    // Setup mock for initial check
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: { id: 'participation-1' },
      error: null
    });
    (supabaseClient.from().select().eq().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
    
    // Setup mock for delete query with error
    const mockError = { message: 'row level security policy error' };
    const mockDelete = vi.fn().mockResolvedValue({
      data: null,
      error: mockError
    });
    (supabaseClient.from().delete().eq().eq as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockDelete);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123e4567-e89b-12d3-a456-426614174000' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
      expect(result.current.isJoined).toBe(true);
    });
    
    // Act - leave the bar crawl
    act(() => {
      result.current.handleLeave();
    });
    
    // Wait for leave to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.error).toBeTruthy();
    expect(mockToast.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error',
        variant: 'destructive'
      })
    );
  });
});
