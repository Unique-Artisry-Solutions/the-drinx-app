
import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { PageSuspense } from './components/loading/PageSuspense';
import { AuthProvider } from './contexts/auth';
import HomePage from './pages/HomePage';
import { CartProvider } from './contexts/CartContext';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import EstablishmentPage from './pages/EstablishmentPage';
import SystemBreakdownPage from './pages/admin/SystemBreakdownPage';
import PurchaseConfirmationPage from './pages/PurchaseConfirmationPage';
import { SavedCodesProvider } from './contexts/SavedCodesContext';
import { FeatureProvider } from './contexts/FeatureContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SavedCodesProvider>
          <FeatureProvider>
            <Router>
              <Suspense fallback={<PageSuspense fallback={<div>Loading...</div>}>{null}</PageSuspense>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/purchase-confirmation" element={<PurchaseConfirmationPage />} />
                  <Route path="/establishment/:id" element={<EstablishmentPage />} />
                  <Route path="/admin/system-breakdown" element={<SystemBreakdownPage />} />
                </Routes>
              </Suspense>
            </Router>
          </FeatureProvider>
        </SavedCodesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
