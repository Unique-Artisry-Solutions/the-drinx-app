
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import ProtectedRoute from './protectedRoutes';
import PageSuspense from '@/components/loading/PageSuspense';

// Lazy load pages
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const ExplorePage = React.lazy(() => import('@/pages/ExplorePage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RewardsPage = React.lazy(() => import('@/pages/rewards/index'));
const NotificationsPage = React.lazy(() => import('@/pages/notifications/NotificationsPage'));
const DebugPage = React.lazy(() => import('@/components/debug/DebugPage'));

// Admin pages
const AdminSystemBreakdownPage = React.lazy(() => import('@/pages/admin/SystemBreakdownPage'));

// Establishment pages
const EstablishmentDashboardPage = React.lazy(() => import('@/pages/establishment/EstablishmentDashboardPage'));

// Promoter pages
const PromoterDashboardPage = React.lazy(() => import('@/pages/promoter/PromoterDashboardPage'));

const AppRoutes: React.FC = () => {
  const { isLoading: authLoading, isAuthenticated, userType } = useAuth();
  const { isInitialized, isDevelopment, devMode } = useDevelopmentMode();

  // Simple loading state - don't block for too long
  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Create a simple redirect component for the root route
  const IndexRedirect = () => {
    // In dev mode, determine where to go based on dev user type
    if (isDevelopment && devMode) {
      switch (devMode) {
        case 'admin':
          return <Navigate to="/admin/system-breakdown" replace />;
        case 'establishment':
          return <Navigate to="/establishment/dashboard" replace />;
        case 'promoter':
          return <Navigate to="/promoter/dashboard" replace />;
        case 'individual':
          return <Navigate to="/explore" replace />;
        default:
          return <Navigate to="/landing" replace />;
      }
    }

    // Normal auth flow
    if (isAuthenticated && userType) {
      switch (userType) {
        case 'admin':
          return <Navigate to="/admin/system-breakdown" replace />;
        case 'establishment':
          return <Navigate to="/establishment/dashboard" replace />;
        case 'promoter':
          return <Navigate to="/promoter/dashboard" replace />;
        default:
          return <Navigate to="/explore" replace />;
      }
    }

    return <Navigate to="/landing" replace />;
  };

  return (
    <PageSuspense>
      <Routes>
        {/* Root route with smart redirect */}
        <Route path="/" element={<IndexRedirect />} />
        
        {/* Public routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        
        {/* Debug route (always accessible in development) */}
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
    </PageSuspense>
  );
};

export default AppRoutes;
