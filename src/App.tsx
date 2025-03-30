
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import AddPage from "./pages/AddPage";
import EstablishmentDetail from "./pages/EstablishmentDetail";
import CocktailDetail from "./pages/CocktailDetail";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import BarCrawlsPage from "./pages/profile/BarCrawlsPage";
import FavoritesPage from "./pages/profile/FavoritesPage";
import VisitedPage from "./pages/profile/VisitedPage";
import CreateBarCrawlPage from "./pages/profile/CreateBarCrawlPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import EstablishmentProfilePage from "./pages/establishment/EstablishmentProfilePage";
import MissionPage from "./pages/MissionPage";
import ResourcesPage from "./pages/ResourcesPage";
import LegalPage from "./pages/LegalPage";
import VerifyEmail from "./pages/VerifyEmail";
import Explore from "./pages/Explore";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEstablishmentsPage from "./pages/admin/AdminEstablishmentsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const EmailVerificationHandler = () => {
  const location = useLocation();
  const { refreshSession } = useAuth();
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      if (location.search.includes('email_confirmed=true')) {
        await refreshSession();
        // Redirect will be handled in AuthContext
      }
    };
    
    handleEmailConfirmation();
  }, [location, refreshSession]);
  
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const TypedProtectedRoute = ({ 
  userType, 
  children 
}: { 
  userType: 'individual' | 'establishment', 
  children: React.ReactNode 
}) => {
  const { user, isLoading, isEmailVerified } = useAuth();
  const storedUserType = localStorage.getItem('user_type');
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (storedUserType !== userType) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AuthenticatedApp = () => {
  return (
    <>
      <EmailVerificationHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/legal" element={<LegalPage />} />
        
        <Route path="/explore" element={<Explore />} />
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
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthenticatedApp />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
