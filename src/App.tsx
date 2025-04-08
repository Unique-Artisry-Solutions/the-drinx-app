
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/auth';
import './App.css';

import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import MapPage from './pages/MapPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CocktailDetail from './pages/CocktailDetail';
import EstablishmentDetail from './pages/EstablishmentDetail';
import CheckoutPage from './pages/CheckoutPage';
import AddPage from './pages/AddPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminEstablishmentsPage from './pages/admin/AdminEstablishmentsPage';
import SystemFunctionalityBreakdown from './pages/admin/SystemFunctionalityBreakdown';
import PhotoModerationPage from './pages/admin/PhotoModerationPage';
import ThemeCustomizationPage from './pages/admin/ThemeCustomizationPage';
import EstablishmentDashboardPage from './pages/establishment/EstablishmentDashboardPage';
import EstablishmentProfilePage from './pages/establishment/EstablishmentProfilePage';
import SettingsPage from './pages/SettingsPage';
import SwigCircuitsPage from './pages/SwigCircuitsPage';
import BarCrawlProfilePage from './pages/BarCrawlProfilePage';
import AllActionsPage from './pages/establishment/AllActionsPage';
import EstablishmentAnalyticsPage from './pages/establishment/EstablishmentAnalyticsPage';

// Provider
import AppProviders from './providers/AppProviders';

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
      <Route path="/404" element={<NotFound />} />
      
      {/* Protected User Routes */}
      <Route path="/home" element={user ? <Explore /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/map" element={user ? <MapPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/add" element={user ? <AddPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/swigcircuit" element={user ? <SwigCircuitsPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/barcrawl/:id" element={user ? <BarCrawlProfilePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      
      {/* Establishment Routes */}
      <Route path="/establishment/dashboard" element={user ? <EstablishmentDashboardPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/establishment/profile" element={user ? <EstablishmentProfilePage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/establishment/all-actions" element={user ? <AllActionsPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      <Route path="/establishment/analytics" element={user ? <EstablishmentAnalyticsPage /> : <Navigate to="/login" state={{ from: location }} replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/users" element={isAdmin ? <AdminUsersPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/establishments" element={isAdmin ? <AdminEstablishmentsPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/system-breakdown" element={isAdmin ? <SystemFunctionalityBreakdown /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
      <Route path="/admin/photo-moderation" element={isAdmin ? <PhotoModerationPage /> : <Navigate to="/admin/login" state={{ from: location }} replace />} />
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
