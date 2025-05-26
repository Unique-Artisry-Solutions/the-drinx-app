
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import { CartProvider } from '@/contexts/CartContext';
import { StripeProvider } from '@/contexts/StripeContext';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailsPage from '@/pages/promoter/events/EventDetailsPage';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import Explore from '@/pages/Explore';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import EstablishmentDashboardPage from '@/pages/establishment/EstablishmentDashboardPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import MyTicketsPage from '@/pages/MyTicketsPage';
import NotFound from '@/pages/NotFound';
import { PromoterRoute } from '@/components/PromoterRoute';
import { EstablishmentRoute } from '@/components/EstablishmentRoute';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <DevelopmentModeProvider>
          <ThemeProvider>
            <CartProvider>
              <AuthProvider>
                <StripeProvider>
                  <div className="min-h-screen bg-gray-50">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/landing" element={<LandingPage />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/event/:eventId" element={<EventDetailsPage />} />
                      <Route path="/swig-circuits" element={<SwigCircuitsPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />

                      <Route path="/promoter-dashboard" element={<PromoterRoute><PromoterDashboardPage /></PromoterRoute>} />
                      <Route path="/establishment-dashboard" element={<EstablishmentRoute><EstablishmentDashboardPage /></EstablishmentRoute>} />
                      
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/checkout/:eventId" element={<CheckoutPage />} />
                      <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
                      <Route path="/my-tickets" element={<MyTicketsPage />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </div>
                </StripeProvider>
              </AuthProvider>
            </CartProvider>
          </ThemeProvider>
        </DevelopmentModeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
