import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import MapPage from '@/pages/MapPage';
import NotFound from '@/pages/NotFound';
import EstablishmentDetail from '@/pages/EstablishmentDetail';
import Explore from '@/pages/Explore';
import CocktailDetail from '@/pages/CocktailDetail';
import BarCrawlDetail from '@/pages/BarCrawlDetail';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import MyCreationsPage from '@/pages/profile/MyCreationsPage';
import CreateBarCrawlPage from '@/pages/profile/CreateBarCrawlPage';
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

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserProfile = lazy(() => import('@/pages/admin/AdminUserProfile'));
const AdminEstablishmentsPage = lazy(() => import('@/pages/admin/AdminEstablishmentsPage'));
const AdminEstablishmentProfile = lazy(() => import('@/pages/admin/AdminEstablishmentProfile'));

// Establishment pages
const EstablishmentProfilePage = lazy(() => import('@/pages/establishment/EstablishmentProfilePage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/establishment/:id" element={<EstablishmentDetail />} />
        <Route path="/cocktail/:id" element={<CocktailDetail />} />
        <Route path="/bar-crawl/:id" element={<BarCrawlDetail />} />
        <Route path="/bar-crawl-details/:id" element={<BarCrawlProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verification" element={<EmailVerificationHandler />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/favorites" element={<FavoritesPage />} />
        <Route path="/profile/visited" element={<VisitedPage />} />
        <Route path="/profile/bar-crawls" element={<BarCrawlsPage />} />
        <Route path="/profile/my-creations" element={<MyCreationsPage />} />
        <Route path="/profile/rewards" element={<RewardsPage />} />
        <Route path="/profile/settings" element={<UserProfilePage />} />
        <Route path="/create-bar-crawl" element={<CreateBarCrawlPage />} />
        <Route path="/profile/my-creations/:id" element={<BarCrawlManagementPage />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/:id" element={<AdminUserProfile />} />
        <Route path="/admin/establishments" element={<AdminEstablishmentsPage />} />
        <Route path="/admin/establishments/:id" element={<AdminEstablishmentProfile />} />
        
        {/* Establishment routes */}
        <Route path="/establishment/profile" element={<EstablishmentProfilePage />} />
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
