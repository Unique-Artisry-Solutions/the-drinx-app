import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import PerformanceMonitor from '@/components/common/PerformanceMonitor';

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message?.includes('auth') || error?.message?.includes('session')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Centralized app providers with error boundaries and performance monitoring
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <DevelopmentModeProvider>
              <ErrorBoundary>
                <AuthProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                  <Toaster />
                  <PerformanceMonitor />
                </AuthProvider>
              </ErrorBoundary>
            </DevelopmentModeProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppProviders;