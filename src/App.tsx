
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
      
      // If user is not authenticated and not on a public path, redirect to landing
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
          navigate('/establishment/all-actions', { replace: true });
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
      
      // If trying to access establishment directly and authenticated as establishment
      if (location.pathname === '/establishment' && user && userType === 'establishment') {
        navigate('/establishment/all-actions', { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.pathname]);
  
  return <AppRoutes />;
};

export default App;
