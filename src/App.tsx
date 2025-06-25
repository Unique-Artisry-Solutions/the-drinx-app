
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import EmailVerificationHandler from '@/routes/EmailVerificationHandler';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Landing = lazy(() => import('@/pages/Landing'));
const Explore = lazy(() => import('@/pages/Explore'));
const Establishments = lazy(() => import('@/pages/Establishments'));
const EstablishmentDetails = lazy(() => import('@/pages/EstablishmentDetails'));
const CocktailDetails = lazy(() => import('@/pages/CocktailDetails'));
const Profile = lazy(() => import('@/pages/Profile'));
const SwigCircuits = lazy(() => import('@/pages/SwigCircuits'));
const SwigCircuitDetails = lazy(() => import('@/pages/SwigCircuitDetails'));
const Events = lazy(() => import('@/pages/Events'));
const EventDetails = lazy(() => import('@/pages/EventDetails'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

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
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/establishments" element={<Establishments />} />
                    <Route path="/establishment/:id" element={<EstablishmentDetails />} />
                    <Route path="/cocktail/:id" element={<CocktailDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/swig-circuits" element={<SwigCircuits />} />
                    <Route path="/swig-circuit/:id" element={<SwigCircuitDetails />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/event/:id" element={<EventDetails />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
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
