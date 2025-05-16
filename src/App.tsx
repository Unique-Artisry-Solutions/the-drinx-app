
import React, { Suspense } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PageSuspense from './components/loading/PageSuspense';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import PurchaseConfirmationPage from './pages/PurchaseConfirmationPage';
import { SavedCodesProvider } from './contexts/SavedCodesContext';

function App() {
  return (
    <SavedCodesProvider>
      <Suspense fallback={<PageSuspense />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<div>Home Page</div>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/purchase-confirmation" element={<PurchaseConfirmationPage />} />
          <Route path="/establishment/:id" element={<div>Establishment Page</div>} />
          <Route path="/admin/system-breakdown" element={<div>System Breakdown Page</div>} />
        </Routes>
      </Suspense>
    </SavedCodesProvider>
  );
}

export default App;
