
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/auth';
import './App.css';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CocktailDetail from './pages/CocktailDetail';
import EstablishmentDetail from './pages/EstablishmentDetail';
import CheckoutPage from './pages/CheckoutPage';
import AddPage from './pages/AddPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminEstablishmentsPage from './pages/admin/AdminEstablishmentsPage';
import AdminSystemBreakdownPage from './pages/admin/AdminSystemBreakdownPage';
import AdminPhotoModerationPage from './pages/admin/AdminPhotoModerationPage';
import ThemeCustomizationPage from './pages/admin/ThemeCustomizationPage';
import EstablishmentDashboardPage from './pages/establishment/EstablishmentDashboardPage';
import SettingsPage from './pages/SettingsPage';

// Import the PhotoModerationPage component
// import PhotoModerationPage from './pages/admin/PhotoModerationPage';

// Provider
import AppProviders from './providers/AppProviders';

// For testing integrations
// import TestPage from './pages/TestPage';
import SwigCircuitPage from './pages/SwigCircuitPage';
import BarCrawlProfilePage from './pages/BarCrawlProfilePage';

function AppContent() {
  const { isLoading, user, isEmailVerified } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = () => {
      const adminAuthenticated = localStorage.getItem('admin_authenticated');
      setIsAdmin(adminAuthenticated === 'true');
    };
    
    checkAdmin();
    // Re-run this check whenever the route changes
    window.addEventListener('storage', checkAdmin);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
    };
  }, [location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cocktail/:id" element={<CocktailDetail />} />
      <Route path="/establishment/:id" element={<EstablishmentDetail />} />
      <Route path="/404" element={<NotFoundPage />} />
      
      {/* Protected User Routes */}
      <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/add" element={user ? <AddPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/swigcircuit" element={user ? <SwigCircuitPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/barcrawl/:id" element={user ? <BarCrawlProfilePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      
      {/* Establishment Routes */}
      <Route path="/establishment/dashboard" element={user ? <EstablishmentDashboardPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/users" element={isAdmin ? <AdminUsersPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/establishments" element={isAdmin ? <AdminEstablishmentsPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/system-breakdown" element={isAdmin ? <AdminSystemBreakdownPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/photo-moderation" element={isAdmin ? <AdminPhotoModerationPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/theme-customization" element={isAdmin ? <ThemeCustomizationPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      
      {/* Catch All (404) */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
