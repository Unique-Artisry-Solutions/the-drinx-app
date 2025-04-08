
import React, { useEffect } from 'react';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './App.css';

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
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
