
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Auth context for global state management
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
    setIsAuthenticated(false);
  };
  
  // Check auth status on mount and when localStorage changes
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

// Route Guard component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status on initial load and when it changes
    const checkAuth = () => {
      const auth = localStorage.getItem('user_authenticated') === 'true';
      setIsAuthenticated(auth);
    };
    
    checkAuth();
    
    // Listen for storage events (in case authentication state changes in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={isAuthenticated ? <Index /> : <LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Protected routes */}
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
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
