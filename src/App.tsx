
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import { StripeProvider } from '@/contexts/StripeContext';
import LandingPage from '@/pages/LandingPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailsPage from '@/pages/promoter/events/EventDetailsPage';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import EstablishmentDashboardPage from '@/pages/establishment/EstablishmentDashboardPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import MyTicketsPage from '@/pages/MyTicketsPage';
import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { PromoterRoute } from '@/components/PromoterRoute';
import { EstablishmentRoute } from '@/components/EstablishmentRoute';

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <CartProvider>
          <AuthProvider>
            <StripeProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
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
      </QueryClientProvider>
    </Router>
  );
}

export default App;
