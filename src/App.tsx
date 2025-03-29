
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const storedUserType = localStorage.getItem('user_type');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (storedUserType !== userType) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                <Route path="/mission" element={<MissionPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/legal" element={<LegalPage />} />
                
                <Route path="/explore" element={<Navigate to="/" replace />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/add" element={<AddPage />} />
                <Route path="/create-bar-crawl" element={<CreateBarCrawlPage />} />
                <Route path="/establishment/:id" element={<EstablishmentDetail />} />
                <Route path="/cocktail/:id" element={<CocktailDetail />} />
                
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/bar-crawls" element={<BarCrawlsPage />} />
                <Route path="/profile/favorites" element={<FavoritesPage />} />
                <Route path="/profile/visited" element={<VisitedPage />} />
                <Route path="/establishment/profile" element={<EstablishmentProfilePage />} />
                
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
