
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { StripeProvider } from '@/contexts/StripeContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { FeatureProvider } from '@/contexts/FeatureContext';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import { Toaster } from '@/components/ui/toaster';
import AppErrorBoundary from '@/components/common/AppErrorBoundary';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Query retry:', { failureCount, error });
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: (failureCount, error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Mutation retry:', { failureCount, error });
        }
        return failureCount < 2;
      },
    },
  }
});

/**
 * Main providers wrapper for the application
 * Contains all the context providers needed for the app to function
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppErrorBoundary fallbackRoute="/landing">
      <QueryClientProvider client={queryClient}>
        <DevelopmentModeProvider>
          <AuthErrorBoundary fallbackRoute="/landing">
            <AuthProvider>
              <ThemeProvider>
                <NavigationProvider>
                  <CartProvider>
                    <StripeProvider>
                      <FeatureProvider>
                        {children}
                        <Toaster />
                      </FeatureProvider>
                    </StripeProvider>
                  </CartProvider>
                </NavigationProvider>
              </ThemeProvider>
            </AuthProvider>
          </AuthErrorBoundary>
        </DevelopmentModeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
