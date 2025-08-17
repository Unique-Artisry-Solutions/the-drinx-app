
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
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

/**
 * Main providers wrapper for the application
 * Contains all the context providers needed for the app to function
 * Now includes DevelopmentModeProvider for centralized dev mode state
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary onError={(error) => console.error('🚨 App-level error:', error)}>
        <DevelopmentModeProvider>
          <AuthErrorBoundary fallbackRoute="/landing">
            <ErrorBoundary onError={(error) => console.error('🚨 Auth-level error:', error)}>
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
            </ErrorBoundary>
          </AuthErrorBoundary>
        </DevelopmentModeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default AppProviders;
