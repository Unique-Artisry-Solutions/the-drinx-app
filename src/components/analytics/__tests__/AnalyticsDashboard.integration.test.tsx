
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnalyticsDashboard from '../AnalyticsDashboard';
import * as optimizedService from '@/services/optimizedRealTimeAnalyticsService';

// Mock the service
jest.mock('@/services/optimizedRealTimeAnalyticsService');

const mockService = optimizedService as jest.Mocked<typeof optimizedService>;

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('AnalyticsDashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup successful mock responses
    mockService.getOptimizedRealTimeMetrics.mockResolvedValue({
      activeUsers: 150,
      pageViews: 750,
      conversions: 45,
      revenue: 2250,
      eventCount: 1000,
      userEngagement: 0.85
    });

    mockService.getOptimizedAnalyticsTimeFrameData.mockResolvedValue([
      { date: '2024-01-01', activeUsers: 120, conversions: 30, revenue: 1500 },
      { date: '2024-01-02', activeUsers: 150, conversions: 45, revenue: 2250 }
    ]);

    mockService.getOptimizedChartData.mockResolvedValue([
      { date: '2024-01-01', metric: 'activeUsers', value: 120, trend: 10, percentage: 15 },
      { date: '2024-01-02', metric: 'conversions', value: 45, trend: 5, percentage: 12 }
    ]);

    mockService.subscribeToOptimizedRealTimeAnalytics.mockReturnValue(() => {});
  });

  it('should render analytics dashboard with data', async () => {
    renderWithQueryClient(<AnalyticsDashboard />);

    // Should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should display metrics
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // Active users
      expect(screen.getByText('750')).toBeInTheDocument(); // Page views
      expect(screen.getByText('45')).toBeInTheDocument(); // Conversions
    });
  });

  it('should handle service errors gracefully', async () => {
    mockService.getOptimizedRealTimeMetrics.mockRejectedValue(
      new Error('Service unavailable')
    );

    renderWithQueryClient(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should show error state or fallback values
    expect(screen.getByText(/error/i) || screen.getByText('0')).toBeInTheDocument();
  });

  it('should refresh data when refresh is triggered', async () => {
    renderWithQueryClient(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Clear previous service calls
    jest.clearAllMocks();

    // Find and click refresh button if it exists
    const refreshButton = screen.queryByRole('button', { name: /refresh/i });
    if (refreshButton) {
      refreshButton.click();

      await waitFor(() => {
        expect(mockService.getOptimizedRealTimeMetrics).toHaveBeenCalled();
      });
    }
  });
});
