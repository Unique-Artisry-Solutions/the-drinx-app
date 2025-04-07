
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBarCrawlParticipation } from '../useBarCrawlParticipation';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
vi.mock('@/lib/supabaseClient', () => ({
  supabaseClient: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
  }
}));

vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    getAll: () => store
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useBarCrawlParticipation', () => {
  // Setup common mocks
  const mockToast = { toast: vi.fn() };
  const mockUser = { id: 'test-user-id' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });
    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockToast);
  });

  describe('Initial status check', () => {
    it('should check the participation status on mount for a real bar crawl ID', async () => {
      // Setup mock for select query
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { id: 'participation-1' },
        error: null
      });
      (supabaseClient.from().select().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
      
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

  describe('Join functionality', () => {
    it('should handle joining a real bar crawl with valid UUID', async () => {
      // Setup mock for insert query
      const mockInsert = vi.fn().mockResolvedValue({
        data: { id: 'new-participation' },
        error: null
      });
      (supabaseClient.from().insert as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInsert);
      
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
      (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });
      
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
      (supabaseClient.from().insert as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockInsert);
      
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

  describe('Leave functionality', () => {
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
      (supabaseClient.from().select().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
      
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
        { bar_crawl_id: 'bc-789', user_id: mockUser.id }
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
      (supabaseClient.from().select().eq().maybeSingle as unknown as ReturnType<typeof vi.fn>).mockImplementation(mockMaybeSingle);
      
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
});
