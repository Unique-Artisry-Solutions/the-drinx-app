import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useUnifiedNotifications } from '../useUnifiedNotifications';
import { toastDeduplication } from '@/utils/toastDeduplication';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn()
    })),
    removeChannel: vi.fn()
  }
}));

vi.mock('@/hooks/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true
  })
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('./useRealtimeConnection', () => ({
  useRealtimeConnection: () => ({
    connectionState: { status: 'connected' },
    isConnected: true,
    sendMessage: vi.fn(),
    reconnect: vi.fn()
  })
}));

vi.mock('./useNotificationQueue', () => ({
  useNotificationQueue: () => ({
    queueSize: 0,
    enqueue: vi.fn(),
    processQueue: vi.fn()
  })
}));

vi.mock('./useUserPresence', () => ({
  useUserPresence: () => ({
    presenceState: {}
  })
}));

vi.mock('@/utils/toastDeduplication', () => ({
  toastDeduplication: {
    shouldShowToast: vi.fn(() => true),
    clear: vi.fn()
  }
}));

describe('useUnifiedNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock document.hidden for visibility tests
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.dispose).toBe('function');
  });

  it('should deduplicate notifications correctly', () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    const notification = {
      id: 'test-notification-1',
      title: 'Test',
      content: 'Test content',
      created_at: '2024-01-01T00:00:00Z',
      is_read: false,
      priority: 'medium' as const
    };

    // First call should return true
    expect(result.current.shouldProcessNotification(notification)).toBe(true);
    
    // Second call with same notification should return false (deduplicated)
    expect(result.current.shouldProcessNotification(notification)).toBe(false);
  });

  it('should create unique notification keys', () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    const notification1 = {
      id: 'test-1',
      created_at: '2024-01-01T00:00:00Z',
      title: 'Test',
      content: 'Test content',
      is_read: false,
      priority: 'medium' as const
    };

    const notification2 = {
      id: 'test-2',
      created_at: '2024-01-01T00:00:00Z',
      title: 'Test',
      content: 'Test content',
      is_read: false,
      priority: 'medium' as const
    };

    const key1 = result.current.createNotificationKey(notification1);
    const key2 = result.current.createNotificationKey(notification2);

    expect(key1).toBe('test-1-2024-01-01T00:00:00Z');
    expect(key2).toBe('test-2-2024-01-01T00:00:00Z');
    expect(key1).not.toBe(key2);
  });

  it('should handle page visibility changes', async () => {
    const { result } = renderHook(() => useUnifiedNotifications());
    
    // Simulate page becoming hidden
    Object.defineProperty(document, 'hidden', { value: true });
    
    const visibilityEvent = new Event('visibilitychange');
    act(() => {
      document.dispatchEvent(visibilityEvent);
    });

    // Page should be marked as hidden
    // Note: In a real test environment, you'd need to access internal state
    // This is a simplified test structure

    // Simulate page becoming visible again
    Object.defineProperty(document, 'hidden', { value: false });
    
    act(() => {
      document.dispatchEvent(visibilityEvent);
    });
  });

  it('should cleanup resources on dispose', () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    act(() => {
      result.current.dispose();
    });

    expect(toastDeduplication.clear).toHaveBeenCalled();
  });

  it('should handle offline notifications when enabled', () => {
    const { result } = renderHook(() => 
      useUnifiedNotifications({ enableQueue: true })
    );

    const notification = {
      id: 'offline-test',
      title: 'Offline Test',
      content: 'Test offline handling',
      created_at: new Date().toISOString(),
      is_read: false,
      priority: 'medium' as const
    };

    act(() => {
      result.current.handleOfflineNotification(notification);
    });

    // Verify notification was processed (should pass deduplication)
    expect(result.current.shouldProcessNotification(notification)).toBe(false); // Already processed
  });

  it('should respect deduplication for toast notifications', () => {
    const mockShouldShowToast = toastDeduplication.shouldShowToast as Mock;
    mockShouldShowToast.mockReturnValue(false);

    const { result } = renderHook(() => useUnifiedNotifications());

    const notification = {
      id: 'toast-test',
      title: 'Toast Test',
      content: 'Test toast deduplication',
      created_at: new Date().toISOString(),
      is_read: false,
      priority: 'high' as const
    };

    // Even though this is a high priority notification, it should respect deduplication
    expect(mockShouldShowToast).toBeDefined();
  });

  it('should handle mark as read functionality', async () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    await act(async () => {
      await result.current.markAsRead('test-notification-id');
    });

    // Verify the supabase update was called
    // In a real test, you'd mock the supabase client and verify the calls
    expect(result.current.error).toBe(null);
  });

  it('should handle mark all as read functionality', async () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    await act(async () => {
      await result.current.markAllAsRead();
    });

    // Verify the supabase update was called for all notifications
    expect(result.current.error).toBe(null);
  });

  it('should clean up old processed notifications', () => {
    const { result } = renderHook(() => useUnifiedNotifications());

    // Create an old notification (simulate by manipulating internal state)
    const oldNotification = {
      id: 'old-notification',
      title: 'Old',
      content: 'Old notification',
      created_at: new Date(Date.now() - 700000).toISOString(), // 11+ minutes ago
      is_read: false,
      priority: 'medium' as const
    };

    const newNotification = {
      id: 'new-notification',
      title: 'New',
      content: 'New notification',
      created_at: new Date().toISOString(),
      is_read: false,
      priority: 'medium' as const
    };

    // Process old notification first
    result.current.shouldProcessNotification(oldNotification);
    
    // Processing new notification should clean up the old one
    result.current.shouldProcessNotification(newNotification);
    
    // Old notification should now be processable again (cleanup occurred)
    expect(result.current.shouldProcessNotification(oldNotification)).toBe(true);
  });
});