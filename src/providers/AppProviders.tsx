
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { StripeProvider } from '@/contexts/StripeContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { FeatureProvider } from '@/contexts/FeatureContext';
import { Toaster } from '@/components/ui/toaster';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';

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
 * Now includes AuthErrorBoundary for proper error recovery
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default AppProviders;
