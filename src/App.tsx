
import React, { useEffect } from 'react';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/auth';

const App = () => {
  // Initialize the app by checking localStorage for admin bypass or session info
  useEffect(() => {
    // Debug authentication state on app initialization
    const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
    const isUserAuth = localStorage.getItem('user_authenticated') === 'true';
    const userType = localStorage.getItem('user_type');
    
    console.log('App initialization:', {
      adminAuthenticated: isAdminAuth,
      userAuthenticated: isUserAuth,
      userType
    });
  }, []);

  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

// Separate component to use hooks that require router context
const AppContent = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userType = localStorage.getItem('user_type');
      
      console.log('Navigation check:', {
        path: location.pathname,
        user: !!user,
        userType,
        isAdmin: isAdminAuth
      });
      
      // If on a 404 page, don't redirect
      if (location.pathname === '/404') {
        return;
      }
      
      // Always allow access to landing, login, signup, mission pages regardless of auth state
      const publicPaths = ['/landing', '/login', '/signup', '/mission', '/resources', '/pricing'];
      
      // Specific handling for admin login and routes
      if (location.pathname === '/admin' || location.pathname === '/admin/login') {
        // If not admin authenticated, allow access to admin login page
        if (!isAdminAuth) {
          return;
        }
        // If admin authenticated, redirect to admin dashboard
        else {
          navigate('/admin/system-breakdown', { replace: true });
          return;
        }
      }
      
      // For all other admin routes, require admin authentication
      if (location.pathname.startsWith('/admin/') && !isAdminAuth) {
        navigate('/admin', { replace: true });
        return;
      }
      
      // If user is not authenticated and not on a public path or admin login, redirect to landing
      if (!user && !publicPaths.includes(location.pathname) && 
          !location.pathname.startsWith('/admin') &&
          location.pathname !== '/') {
        navigate('/landing', { replace: true });
        return;
      }
      
      // Special handling for root path
      if (location.pathname === '/') {
        // If admin is authenticated, redirect to admin dashboard
        if (isAdminAuth) {
          navigate('/admin/system-breakdown', { replace: true });
        }
        // If establishment is authenticated, redirect to establishment dashboard
        else if (user && userType === 'establishment') {
          navigate('/establishment/dashboard', { replace: true });
        }
        // If individual user is authenticated, redirect to explore page
        else if (user && userType === 'individual') {
          navigate('/explore', { replace: true });
        }
        // Otherwise redirect to landing
        else {
          navigate('/landing', { replace: true });
        }
        return;
      }
      
      // If trying to access /establishment directly, redirect to dashboard
      if (location.pathname === '/establishment' && user && userType === 'establishment') {
        navigate('/establishment/dashboard', { replace: true });
        return;
      }
    }
  }, [user, isLoading, navigate, location.pathname]);
  
  return <AppRoutes />;
};

export default App;
