import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import MapPage from '@/pages/MapPage';
import NotFound from '@/pages/NotFound';
import EstablishmentDetail from '@/pages/EstablishmentDetail';
import Explore from '@/pages/Explore';
import CocktailDetail from '@/pages/CocktailDetail';
import BarCrawlDetail from '@/pages/BarCrawlDetail';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import MyCreationsPage from '@/pages/profile/MyCreationsPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';
import RewardsPage from '@/pages/profile/RewardsPage';
import Profile from '@/pages/ProfilePage';
import CheckoutPage from '@/pages/CheckoutPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import VerifyEmail from '@/pages/VerifyEmail';
import FavoritesPage from '@/pages/profile/FavoritesPage';
import VisitedPage from '@/pages/profile/VisitedPage';
import BarCrawlsPage from '@/pages/profile/BarCrawlsPage';
import BarCrawlProfilePage from '@/pages/BarCrawlProfilePage';
import { BarCrawlManagementPage } from '@/imports';
import ResourcesPage from '@/pages/ResourcesPage';
import MissionPage from '@/pages/MissionPage';
import PricingPage from '@/pages/PricingPage';
import EmailVerificationHandler from '@/routes/EmailVerificationHandler';
import PrivacyPolicy from '@/pages/LegalPage';
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import SwigCircuitRequestsPage from '@/pages/establishment/SwigCircuitRequestsPage';
import EstablishmentReviewsPage from '@/pages/establishment/EstablishmentReviewsPage';
import MocktailDetailsPage from '@/pages/establishment/MocktailDetailsPage';
import EstablishmentAnalyticsPage from '@/pages/establishment/EstablishmentAnalyticsPage';
import AllActionsPage from '@/pages/establishment/AllActionsPage';
import MocktailSuggestionsPage from '@/pages/establishment/MocktailSuggestionsPage';
import SettingsPage from '@/pages/SettingsPage';
import UserRecipesPage from '@/pages/profile/UserRecipesPage';
import { ProtectedRoute, TypedProtectedRoute } from './protectedRoutes';

import EstablishmentProfilePage from '@/pages/establishment/EstablishmentProfilePage';
import MocktailMenuPage from '@/pages/establishment/MocktailMenuPage';
import PromotionsPage from '@/pages/establishment/PromotionsPage';

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserProfile = lazy(() => import('@/pages/admin/AdminUserProfile'));
const AdminEstablishmentsPage = lazy(() => import('@/pages/admin/AdminEstablishmentsPage'));
const AdminEstablishmentProfile = lazy(() => import('@/pages/admin/AdminEstablishmentProfile'));
const SystemFunctionalityBreakdown = lazy(() => import('@/pages/admin/SystemFunctionalityBreakdown'));
const SystemAnalyticsPage = lazy(() => import('@/pages/admin/SystemAnalyticsPage'));
const PhotoModerationPage = lazy(() => import('@/pages/admin/PhotoModerationPage'));
const ContentModerationPage = lazy(() => import('@/pages/admin/ContentModerationPage'));

import EstablishmentDashboardPage from '@/pages/establishment/EstablishmentDashboardPage';

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/establishment/:id" element={<EstablishmentDetail />} />
        <Route path="/cocktail/:id" element={<CocktailDetail />} />
        <Route path="/bar-crawl/:id" element={<BarCrawlDetail />} />
        <Route path="/bar-crawl-details/:id" element={<BarCrawlProfilePage />} />
        <Route path="/swig-circuits" element={<SwigCircuitsPage />} />
        <Route path="/bar-crawl" element={<Navigate to="/swig-circuits" replace />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verification" element={<EmailVerificationHandler />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/profile/visited" element={<ProtectedRoute><VisitedPage /></ProtectedRoute>} />
        <Route path="/profile/bar-crawls" element={<ProtectedRoute><BarCrawlsPage /></ProtectedRoute>} />
        <Route path="/profile/my-creations" element={<ProtectedRoute><MyCreationsPage /></ProtectedRoute>} />
        <Route path="/profile/recipes" element={<ProtectedRoute><UserRecipesPage /></ProtectedRoute>} />
        <Route path="/profile/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
        <Route path="/profile/settings" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/create-bar-crawl" element={<ProtectedRoute><CreateSwigCircuitPage /></ProtectedRoute>} />
        <Route path="/create-swig-circuit" element={<ProtectedRoute><CreateSwigCircuitPage /></ProtectedRoute>} />
        <Route path="/profile/my-creations/:id" element={<ProtectedRoute><BarCrawlManagementPage /></ProtectedRoute>} />
        
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:id" element={<AdminUserProfile />} />
        <Route path="/admin/establishments" element={<AdminEstablishmentsPage />} />
        <Route path="/admin/establishments/:id" element={<AdminEstablishmentProfile />} />
        <Route path="/admin/system-breakdown" element={<SystemFunctionalityBreakdown />} />
        <Route path="/admin/analytics" element={<SystemAnalyticsPage />} />
        <Route path="/admin/photo-moderation" element={<PhotoModerationPage />} />
        <Route path="/admin/content-moderation" element={<ContentModerationPage />} />
        
        {/* Always redirect /establishment to the dashboard */}
        <Route path="/establishment" element={
          <TypedProtectedRoute userType="establishment">
            <Navigate to="/establishment/dashboard" replace />
          </TypedProtectedRoute>
        } />
        
        <Route path="/establishment/dashboard" element={
          <TypedProtectedRoute userType="establishment">
            <EstablishmentDashboardPage />
          </TypedProtectedRoute>
        } />
        
        <Route path="/establishment/all-actions" element={
          <TypedProtectedRoute userType="establishment">
            <AllActionsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/profile" element={
          <TypedProtectedRoute userType="establishment">
            <EstablishmentProfilePage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/mocktail-menu" element={
          <TypedProtectedRoute userType="establishment">
            <MocktailMenuPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/promotions" element={
          <TypedProtectedRoute userType="establishment">
            <PromotionsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/analytics" element={
          <TypedProtectedRoute userType="establishment">
            <EstablishmentAnalyticsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/bar-crawl-requests" element={
          <TypedProtectedRoute userType="establishment">
            <SwigCircuitRequestsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/reviews" element={
          <TypedProtectedRoute userType="establishment">
            <EstablishmentReviewsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/mocktail/:id" element={
          <TypedProtectedRoute userType="establishment">
            <MocktailDetailsPage />
          </TypedProtectedRoute>
        } />
        <Route path="/establishment/mocktail-suggestions" element={
          <TypedProtectedRoute userType="establishment">
            <MocktailSuggestionsPage />
          </TypedProtectedRoute>
        } />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
