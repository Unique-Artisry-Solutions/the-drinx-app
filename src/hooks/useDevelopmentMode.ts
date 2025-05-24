
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DevUserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

export const useDevelopmentMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [devMode, setDevMode] = useState<DevUserType>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  // Check if we're in development mode
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('preview--') ||
                       window.location.hostname.includes('lovable');
    setIsDevelopment(isLocalhost);
    console.log('Development mode detected:', isLocalhost);
  }, []);

  // Check for URL parameters on route changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const devModeParam = searchParams.get('dev_mode');
    
    if (isDevelopment && devModeParam) {
      const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
      if (validTypes.includes(devModeParam as DevUserType)) {
        const userType = devModeParam as DevUserType;
        setDevMode(userType);
        localStorage.setItem('dev_user_type', userType);
        console.log('Setting dev mode from URL:', userType);
        
        // Navigate to appropriate dashboard without the dev_mode parameter
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('dev_mode');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Navigate to the appropriate dashboard
        navigateToUserTypeDashboard(userType);
      }
    }
  }, [location.search, isDevelopment]);

  // Load saved dev mode from localStorage
  useEffect(() => {
    if (isDevelopment) {
      const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
      if (savedDevType) {
        setDevMode(savedDevType);
        console.log('Loaded dev mode from storage:', savedDevType);
      }
    }
  }, [isDevelopment]);

  const navigateToUserTypeDashboard = (userType: DevUserType) => {
    switch (userType) {
      case 'establishment':
        navigate('/establishment/dashboard');
        break;
      case 'promoter':
        navigate('/promoter/dashboard');
        break;
      case 'admin':
        navigate('/admin/system-breakdown');
        break;
      case 'individual':
        navigate('/explore');
        break;
      default:
        navigate('/landing');
    }
  };

  const switchToUserType = (userType: DevUserType) => {
    if (!isDevelopment) return;
    
    setDevMode(userType);
    console.log('Switching to user type:', userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
      navigateToUserTypeDashboard(userType);
    } else {
      localStorage.removeItem('dev_user_type');
      navigate('/landing');
    }
  };

  const exitDevMode = () => {
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    navigate('/landing');
    console.log('Exited dev mode');
  };

  return {
    isDevelopment,
    devMode,
    switchToUserType,
    exitDevMode,
    isDevModeActive: isDevelopment && devMode !== null
  };
};
