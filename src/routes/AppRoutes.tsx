
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import ProtectedRoute from './protectedRoutes';
import PageSuspense from '@/components/loading/PageSuspense';

// Lazy load pages
const LandingPage = React.lazy(() => import('@/pages/landing/LandingPage'));
const ExplorePage = React.lazy(() => import('@/pages/explore/ExplorePage'));
const ProfilePage = React.lazy(() => import('@/pages/profile/ProfilePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RewardsPage = React.lazy(() => import('@/pages/rewards/index'));
const NotificationsPage = React.lazy(() => import('@/pages/notifications/NotificationsPage'));
const DebugPage = React.lazy(() => import('@/components/debug/DebugPage'));

// Admin pages
const AdminSystemBreakdownPage = React.lazy(() => import('@/pages/admin/AdminSystemBreakdownPage'));

// Establishment pages
const EstablishmentDashboardPage = React.lazy(() => import('@/pages/establishment/EstablishmentDashboardPage'));

// Promoter pages
const PromoterDashboardPage = React.lazy(() => import('@/pages/promoter/PromoterDashboardPage'));

const AppRoutes: React.FC = () => {
  const { isLoading: authLoading } = useAuth();
  const { isInitialized } = useDevelopmentMode();

  // Show loading while initializing
  if (authLoading || !isInitialized) {
    return <PageSuspense />;
  }

  return (
    <Suspense fallback={<PageSuspense />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        
        {/* Debug route (development only) */}
        <Route path="/debug" element={<DebugPage />} />
        
        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <RewardsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/system-breakdown"
          element={
            <ProtectedRoute requiredUserType="admin">
              <AdminSystemBreakdownPage />
            </ProtectedRoute>
          }
        />

        {/* Establishment routes */}
        <Route
          path="/establishment/dashboard"
          element={
            <ProtectedRoute requiredUserType="establishment">
              <EstablishmentDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Promoter routes */}
        <Route
          path="/promoter/dashboard"
          element={
            <ProtectedRoute requiredUserType="promoter">
              <PromoterDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
