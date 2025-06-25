
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import EmailVerificationHandler from '@/routes/EmailVerificationHandler';

// Import existing pages directly - no lazy loading for core pages to avoid import errors
import LandingPage from '@/pages/LandingPage';
// Use AppRoutes for all other routing to avoid duplication
import AppRoutes from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DevelopmentModeProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <EmailVerificationHandler />
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/*" element={<AppRoutes />} />
                  </Routes>
                </Suspense>
              </div>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </DevelopmentModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
