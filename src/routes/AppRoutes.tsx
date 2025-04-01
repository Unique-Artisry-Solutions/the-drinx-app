
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, TypedProtectedRoute } from './protectedRoutes';
import EmailVerificationHandler from './EmailVerificationHandler';
import { useAuth } from '@/contexts/auth';

// Import pages
import Index from "@/pages/Index";
import MapPage from "@/pages/MapPage";
import AddPage from "@/pages/AddPage";
import EstablishmentDetail from "@/pages/EstablishmentDetail";
import CocktailDetail from "@/pages/CocktailDetail";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import BarCrawlsPage from "@/pages/profile/BarCrawlsPage";
import FavoritesPage from "@/pages/profile/FavoritesPage";
import VisitedPage from "@/pages/profile/VisitedPage";
import MyCreationsPage from "@/pages/profile/MyCreationsPage";
import CreateBarCrawlPage from "@/pages/profile/CreateBarCrawlPage";
import CrawlersListPage from "@/pages/profile/CrawlersListPage";
import BarCrawlProfilePage from "@/pages/BarCrawlProfilePage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import PricingPage from "@/pages/PricingPage";
import CheckoutPage from "@/pages/CheckoutPage";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import EstablishmentProfilePage from "@/pages/establishment/EstablishmentProfilePage";
import MissionPage from "@/pages/MissionPage";
import ResourcesPage from "@/pages/ResourcesPage";
import LegalPage from "@/pages/LegalPage";
import VerifyEmail from "@/pages/VerifyEmail";
import Explore from "@/pages/Explore";
import BarCrawlDetail from "@/pages/BarCrawlDetail";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminEstablishmentsPage from "@/pages/admin/AdminEstablishmentsPage";
import AdminUserProfile from "@/pages/admin/AdminUserProfile";
import AdminEstablishmentProfile from "@/pages/admin/AdminEstablishmentProfile";
import BarCrawlDetailsPage from "@/pages/BarCrawlDetailsPage";
import BarCrawlManagementPage from "@/pages/profile/BarCrawlManagementPage";

// Routes that should redirect to /explore if the user is logged in
const publicOnlyRoutes = ['/', '/landing', '/login', '/signup'];

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // If user is authenticated and trying to access a public-only route,
    // redirect them to the explore page
    if (user && !isLoading && publicOnlyRoutes.includes(location.pathname)) {
      navigate('/explore');
    }
  }, [user, isLoading, location.pathname, navigate]);
  
  return (
    <>
      {/* Place EmailVerificationHandler outside of Routes to catch URL parameters regardless of current route */}
      <EmailVerificationHandler />
      
      <Routes>
        <Route path="/" element={<LandingPage />}>
          <Route index element={<Index />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/legal" element={<LegalPage />} />
        
        <Route path="/explore" element={<Explore />} />
        
        <Route path="/bar-crawl/:id" element={<BarCrawlDetail />} />
        <Route path="/bar-crawl-profile/:id" element={<BarCrawlProfilePage />} />
        <Route path="/bar-crawl-details/:id" element={<BarCrawlDetailsPage />} />
        <Route path="/map" element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <AddPage />
          </ProtectedRoute>
        } />
        <Route path="/create-bar-crawl" element={
          <ProtectedRoute>
            <CreateBarCrawlPage />
          </ProtectedRoute>
        } />
        <Route path="/establishment/:id" element={<EstablishmentDetail />} />
        <Route path="/cocktail/:id" element={<CocktailDetail />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/profile/bar-crawls" element={
          <ProtectedRoute>
            <BarCrawlsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/my-creations" element={
          <ProtectedRoute>
            <MyCreationsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/my-creations/:id" element={
          <ProtectedRoute>
            <BarCrawlManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/bar-crawls/participants/:id" element={
          <ProtectedRoute>
            <CrawlersListPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/favorites" element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } />
        <Route path="/profile/visited" element={
          <ProtectedRoute>
            <VisitedPage />
          </ProtectedRoute>
        } />
        <Route path="/establishment/profile" element={
          <TypedProtectedRoute userType="establishment">
            <EstablishmentProfilePage />
          </TypedProtectedRoute>
        } />
        
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } />
        <Route path="/admin/establishments" element={
          <AdminRoute>
            <AdminEstablishmentsPage />
          </AdminRoute>
        } />
        <Route path="/admin/user/:id" element={
          <AdminRoute>
            <AdminUserProfile />
          </AdminRoute>
        } />
        <Route path="/admin/establishment/:id" element={
          <AdminRoute>
            <AdminEstablishmentProfile />
          </AdminRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
