import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { StripeProvider } from '@/contexts/StripeContext';
import HomePage from '@/pages/HomePage';
import EventsPage from '@/pages/EventsPage';
import EventDetailsPage from '@/pages/promoter/events/EventDetailsPage';
import NewEventPage from '@/pages/promoter/events/NewEventPage';
import EditEventPage from '@/pages/promoter/events/EditEventPage';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import SwigCircuitDetailsPage from '@/pages/SwigCircuitDetailsPage';
import NewSwigCircuitPage from '@/pages/NewSwigCircuitPage';
import EditSwigCircuitPage from '@/pages/EditSwigCircuitPage';
import VenuesPage from '@/pages/VenuesPage';
import VenueDetailsPage from '@/pages/VenueDetailsPage';
import NewVenuePage from '@/pages/NewVenuePage';
import EditVenuePage from '@/pages/EditVenuePage';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import EstablishmentDashboardPage from '@/pages/establishment/EstablishmentDashboardPage';
import UserDashboardPage from '@/pages/user/UserDashboardPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import LoginPage from '@/pages/LoginPage';
import LogoutPage from '@/pages/LogoutPage';
import RegisterPage from '@/pages/RegisterPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import SubscriptionSettingsPage from '@/pages/SubscriptionSettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import ContactUsPage from '@/pages/ContactUsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { PromoterRoute } from '@/components/PromoterRoute';
import { EstablishmentRoute } from '@/components/EstablishmentRoute';
import CheckoutPage from '@/pages/CheckoutPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import MyTicketsPage from '@/pages/MyTicketsPage';

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <CartProvider>
          <AuthProvider>
            <StripeProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/event/:eventId" element={<EventDetailsPage />} />
                  <Route path="/swig-circuits" element={<SwigCircuitsPage />} />
                  <Route path="/swig-circuit/:swigCircuitId" element={<SwigCircuitDetailsPage />} />
                  <Route path="/venues" element={<VenuesPage />} />
                  <Route path="/venue/:venueId" element={<VenueDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/logout" element={<LogoutPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account-settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
                  <Route path="/subscription-settings" element={<ProtectedRoute><SubscriptionSettingsPage /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/contact" element={<ContactUsPage />} />

                  <Route path="/promoter-dashboard" element={<PromoterRoute><PromoterDashboardPage /></PromoterRoute>} />
                  <Route path="/establishment-dashboard" element={<EstablishmentRoute><EstablishmentDashboardPage /></EstablishmentRoute>} />
                  <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

                  <Route path="/promoter/events/new" element={<PromoterRoute><NewEventPage /></PromoterRoute>} />
                  <Route path="/promoter/events/edit/:eventId" element={<PromoterRoute><EditEventPage /></PromoterRoute>} />

                  <Route path="/swig-circuits/new" element={<PromoterRoute><NewSwigCircuitPage /></PromoterRoute>} />
                  <Route path="/swig-circuits/edit/:swigCircuitId" element={<PromoterRoute><EditSwigCircuitPage /></PromoterRoute>} />

                  <Route path="/venues/new" element={<EstablishmentRoute><NewVenuePage /></EstablishmentRoute>} />
                  <Route path="/venues/edit/:venueId" element={<EstablishmentRoute><EditVenuePage /></EstablishmentRoute>} />
                  
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/checkout/:eventId" element={<CheckoutPage />} />
                  <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
                  <Route path="/my-tickets" element={<MyTicketsPage />} />

                  <Route path="*" element={<NotFoundPage />} />
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
