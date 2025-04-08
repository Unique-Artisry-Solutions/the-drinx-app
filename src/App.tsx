
import React, { useEffect } from 'react';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { useNavigate } from 'react-router-dom';
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
  
  useEffect(() => {
    if (!isLoading) {
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      const userType = localStorage.getItem('user_type');
      
      // If user is not authenticated, redirect to landing page
      if (!user && window.location.pathname !== '/landing' && 
          window.location.pathname !== '/login' && 
          window.location.pathname !== '/signup' &&
          !window.location.pathname.startsWith('/admin')) {
        navigate('/landing', { replace: true });
      }
      
      // If admin is authenticated, redirect to admin dashboard
      else if (isAdminAuth && window.location.pathname === '/') {
        navigate('/admin/system-breakdown', { replace: true });
      }
      
      // If establishment is authenticated, redirect to establishment dashboard
      else if (user && userType === 'establishment' && window.location.pathname === '/') {
        navigate('/establishment/all-actions', { replace: true });
      }
      
      // If individual user is authenticated, redirect to explore page
      else if (user && userType === 'individual' && window.location.pathname === '/') {
        navigate('/explore', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);
  
  return <AppRoutes />;
};

export default App;
