
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { redactSensitive } from '@/lib/logging/redact';

export interface AnalyticsData {
  [key: string]: any;
}

export interface AnalyticsState {
  data: AnalyticsData;
  isLoading: boolean;
  error: string | null;
  dateRange: { start: Date; end: Date };
}

export interface AnalyticsActions {
  fetchData: (params?: any) => Promise<void>;
  trackEvent: (event: string, properties?: any) => Promise<void>;
  setDateRange: (range: { start: Date; end: Date }) => void;
  refresh: () => Promise<void>;
}

export function useAnalytics(): { state: AnalyticsState; actions: AnalyticsActions } {
  const { toast } = useToast();
  const [state, setState] = useState<AnalyticsState>({
    data: {},
    isLoading: false,
    error: null,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }
  });

  const actions: AnalyticsActions = {
    fetchData: useCallback(async (params?: any) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        // Mock analytics data - replace with actual API call
        const mockData = {
          visits: Math.floor(Math.random() * 1000),
          revenue: Math.floor(Math.random() * 10000),
          conversions: Math.floor(Math.random() * 100),
          ...params
        };
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setState(prev => ({ ...prev, data: mockData, isLoading: false }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }, [toast]),

    trackEvent: useCallback(async (event: string, properties?: any) => {
      try {
        // Mock event tracking - replace with actual tracking service
        const safeProps = redactSensitive(properties);
        console.log('Tracking event:', event, safeProps);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.error('Failed to track event:', err);
      }
    }, []),

    setDateRange: useCallback((range: { start: Date; end: Date }) => {
      setState(prev => ({ ...prev, dateRange: range }));
    }, []),

    refresh: useCallback(async () => {
      await actions.fetchData();
    }, [])
  };

  return { state, actions };
}
