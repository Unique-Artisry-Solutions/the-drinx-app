
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import ProtectedRoute from './protectedRoutes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Core Pages
const HomePage = React.lazy(() => import('@/pages/Index'));
const MapPage = React.lazy(() => import('@/pages/MapPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const EstablishmentPage = React.lazy(() => import('@/pages/EstablishmentDetail'));
const BarCrawlPage = React.lazy(() => import('@/pages/BarCrawlProfilePage'));
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));

const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/*" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/establishment/:id" element={
          <ProtectedRoute>
            <EstablishmentPage />
          </ProtectedRoute>
        } />
        
        <Route path="/bar-crawl/:id" element={
          <ProtectedRoute>
            <BarCrawlPage />
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
