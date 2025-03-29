import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import AddPage from "./pages/AddPage";
import EstablishmentDetail from "./pages/EstablishmentDetail";
import CocktailDetail from "./pages/CocktailDetail";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import EstablishmentProfilePage from "./pages/establishment/EstablishmentProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('user_authenticated') === 'true';
  });
  
  const login = () => {
    localStorage.setItem('user_authenticated', 'true');
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_type');
    setIsAuthenticated(false);
  };
  
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('user_authenticated') === 'true';
      setIsAuthenticated(auth);
    };
    
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  return { isAuthenticated, login, logout };
};

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment'>('individual');
  
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('user_authenticated') === 'true';
      setIsAuthenticated(auth);
      
      const type = localStorage.getItem('user_type');
      if (type === 'establishment') {
        setUserType('establishment');
      } else {
        setUserType('individual');
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Index /> : <LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              <Route path="/explore" element={<Navigate to="/" replace />} />
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
              <Route path="/establishment/:id" element={
                <ProtectedRoute>
                  <EstablishmentDetail />
                </ProtectedRoute>
              } />
              <Route path="/cocktail/:id" element={
                <ProtectedRoute>
                  <CocktailDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <TypedProtectedRoute userType="individual">
                  <UserProfilePage />
                </TypedProtectedRoute>
              } />
              
              <Route path="/establishment/profile" element={
                <TypedProtectedRoute userType="establishment">
                  <EstablishmentProfilePage />
                </TypedProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  {userType === 'establishment' ? 
                    <Navigate to="/establishment/profile" replace /> : 
                    <ProfilePage />
                  }
                </ProtectedRoute>
              } />
              
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
