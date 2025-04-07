
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabaseClient } from '@/lib/supabaseClient';
import { setupMocks, mockToast, getLocalStorageMock } from './utils/barCrawlParticipationTestUtils';

const localStorageMock = getLocalStorageMock();

describe('useBarCrawlParticipation - Join Functionality', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('should handle joining a real bar crawl with valid UUID', async () => {
    // Setup mock for insert query
    const mockInsert = vi.fn().mockResolvedValue({
      data: { id: 'new-participation' },
      error: null
    });
    vi.mocked(supabaseClient.from().insert).mockImplementation(mockInsert);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123e4567-e89b-12d3-a456-426614174000' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    // Act - join the bar crawl
    act(() => {
      result.current.handleJoin();
    });
    
    // Should be in loading state
    expect(result.current.isLoading).toBe(true);
    
    // Wait for join to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(true);
    expect(mockToast.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Joined Swig Circuit'
      })
    );
  });
  
  it('should handle joining a sample bar crawl using localStorage', async () => {
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: 'bc-456' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    // Act - join the bar crawl
    act(() => {
      result.current.handleJoin();
    });
    
    // Wait for join to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isJoined).toBe(true);
    
    // Verify localStorage was updated
    const storedData = JSON.parse(localStorageMock.getItem('user_bar_crawl_participations') || '[]');
    expect(storedData.some((p: any) => p.bar_crawl_id === 'bc-456')).toBe(true);
  });
  
  it('should show error toast if not authenticated', async () => {
    // Mock unauthenticated user
    setupMocks(null);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: 'bc-456' })
    );
    
    // Act - try to join the bar crawl
    act(() => {
      result.current.handleJoin();
    });
    
    expect(mockToast.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sign in required',
        variant: 'destructive'
      })
    );
  });
  
  it('should handle join errors from Supabase', async () => {
    // Setup mock for insert query with error
    const mockError = { message: 'violates unique constraint' };
    const mockInsert = vi.fn().mockResolvedValue({
      data: null,
      error: mockError
    });
    vi.mocked(supabaseClient.from().insert).mockImplementation(mockInsert);
    
    const { result } = renderHook(() => 
      useBarCrawlParticipation({ barCrawlId: '123e4567-e89b-12d3-a456-426614174000' })
    );
    
    // Wait for initial check
    await waitFor(() => {
      expect(result.current.isCheckingStatus).toBe(false);
    });
    
    // Act - join the bar crawl
    act(() => {
      result.current.handleJoin();
    });
    
    // Wait for join to complete
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
