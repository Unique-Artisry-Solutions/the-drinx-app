
import { renderHook, waitFor } from '@testing-library/react';
import { useOptimizedRealTimeAnalytics } from '../useOptimizedRealTimeAnalytics';
import * as optimizedService from '@/services/optimizedRealTimeAnalyticsService';

// Mock the service
jest.mock('@/services/optimizedRealTimeAnalyticsService');

const mockService = optimizedService as jest.Mocked<typeof optimizedService>;

describe('useOptimizedRealTimeAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default successful mock responses
    mockService.getOptimizedRealTimeMetrics.mockResolvedValue({
      activeUsers: 100,
      pageViews: 500,
      conversions: 25,
      revenue: 1250,
      eventCount: 750,
      userEngagement: 0.75
    });

    mockService.getOptimizedAnalyticsTimeFrameData.mockResolvedValue([
      { date: '2024-01-01', activeUsers: 90, conversions: 20, revenue: 1000 },
      { date: '2024-01-02', activeUsers: 110, conversions: 30, revenue: 1500 }
    ]);

    mockService.getOptimizedChartData.mockResolvedValue([
      { date: '2024-01-01', metric: 'activeUsers', value: 90, trend: 5, percentage: 10 },
      { date: '2024-01-02', metric: 'conversions', value: 25, trend: -2, percentage: -5 }
    ]);

    mockService.subscribeToOptimizedRealTimeAnalytics.mockReturnValue(() => {});
  });

  it('should load initial data successfully', async () => {
    const { result } = renderHook(() => 
      useOptimizedRealTimeAnalytics({ enableRealTime: false })
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.metrics).toEqual({
      activeUsers: 100,
      pageViews: 500,
      conversions: 25,
      revenue: 1250,
      eventCount: 750,
      userEngagement: 0.75
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle service errors gracefully', async () => {
    const testError = new Error('Service unavailable');
    mockService.getOptimizedRealTimeMetrics.mockRejectedValue(testError);

    const { result } = renderHook(() => 
      useOptimizedRealTimeAnalytics({ enableRealTime: false })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Service unavailable');
    // Should fallback to default values
    expect(result.current.metrics.activeUsers).toBe(0);
  });

  it('should setup real-time subscription when enabled', async () => {
    renderHook(() => 
      useOptimizedRealTimeAnalytics({ 
        enableRealTime: true,
        refreshInterval: 5000 
      })
    );

    await waitFor(() => {
      expect(mockService.subscribeToOptimizedRealTimeAnalytics).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  it('should refresh data on manual refresh', async () => {
    const { result } = renderHook(() => 
      useOptimizedRealTimeAnalytics({ enableRealTime: false })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Clear previous calls
    jest.clearAllMocks();

    // Trigger refresh
    result.current.refresh();

    await waitFor(() => {
      expect(mockService.getOptimizedRealTimeMetrics).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle partial service failures', async () => {
    // Make one service fail
    mockService.getOptimizedAnalyticsTimeFrameData.mockRejectedValue(
      new Error('Timeframe service down')
    );

    const { result } = renderHook(() => 
      useOptimizedRealTimeAnalytics({ enableRealTime: false })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have metrics from successful service
    expect(result.current.metrics.activeUsers).toBe(100);
    // Should have empty array for failed service
    expect(result.current.timeFrameData).toEqual([]);
    // Should not show error since other services succeeded
    expect(result.current.error).toBeNull();
  });
});
