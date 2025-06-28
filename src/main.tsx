
// Main Application Entry Point - Phase 9E Completed
// Enhanced imports for Phase 9E standard components

// Core React and routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Application core
import App from './App.tsx';
import './index.css';

// Context providers
import { DevelopmentModeProvider } from './contexts/DevelopmentModeContext';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { StripeProvider } from './contexts/StripeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { FeatureProvider } from './contexts/FeatureContext';
import { Toaster } from './components/ui/toaster';

// Phase 9E: Import enhanced validation system
import './utils/typeValidation';

// Initialize QueryClient with Phase 9E optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: (failureCount, error) => {
        // Phase 9E: Enhanced retry logic
        if (process.env.NODE_ENV === 'development') {
          console.warn('Query retry:', { failureCount, error });
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Phase 9E: Enhanced mutation retry logic
        if (process.env.NODE_ENV === 'development') {
          console.warn('Mutation retry:', { failureCount, error });
        }
        return failureCount < 2;
      },
    },
  },
});

// Phase 9E: Enhanced development mode error boundary
const DevErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === 'development') {
    // In development, let errors bubble up for better debugging
    return <>{children}</>;
  }
  
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {children}
    </React.Suspense>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <DevelopmentModeProvider>
            <AuthProvider>
              <ThemeProvider>
                <NavigationProvider>
                  <CartProvider>
                    <StripeProvider>
                      <FeatureProvider>
                        <App />
                        <Toaster />
                      </FeatureProvider>
                    </StripeProvider>
                  </CartProvider>
                </NavigationProvider>
              </ThemeProvider>
            </AuthProvider>
          </DevelopmentModeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </DevErrorBoundary>
  </React.StrictMode>,
);

// Phase 9E: Enhanced development console logging
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Phase 9E Application initialized with enhanced validation');
  console.log('📊 QueryClient configured with optimized retry logic');
  console.log('🔧 Development mode features enabled');
}
