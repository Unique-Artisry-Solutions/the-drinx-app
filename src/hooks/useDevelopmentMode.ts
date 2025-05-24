
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type DevUserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

export const useDevelopmentMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [devMode, setDevMode] = useState<DevUserType>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to prevent render fluctuations and enable synchronous access
  const isDevelopmentRef = useRef<boolean>(false);
  const devModeRef = useRef<DevUserType>(null);
  const initializationRef = useRef<boolean>(false);

  // Initialize development mode detection immediately and persistently
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const detectDevelopmentMode = () => {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || 
                         hostname === '127.0.0.1' ||
                         hostname.includes('preview--') ||
                         hostname.includes('lovable');
      
      console.log('useDevelopmentMode - Development mode detection:', {
        hostname,
        isLocalhost,
        href: window.location.href
      });
      
      isDevelopmentRef.current = isLocalhost;
      setIsDevelopment(isLocalhost);
      setIsInitialized(true);
      
      return isLocalhost;
    };

    const isDevMode = detectDevelopmentMode();
    
    // Load saved dev mode from localStorage if in development
    if (isDevMode) {
      const savedDevType = localStorage.getItem('dev_user_type') as DevUserType;
      if (savedDevType) {
        console.log('useDevelopmentMode - Restored dev mode from storage:', savedDevType);
        devModeRef.current = savedDevType;
        setDevMode(savedDevType);
      }
    } else {
      // Clear dev mode if not in development
      localStorage.removeItem('dev_user_type');
      devModeRef.current = null;
      setDevMode(null);
    }
  }, []);

  // Check for URL parameters on route changes (only after initialization)
  useEffect(() => {
    if (!isInitialized || !isDevelopmentRef.current) return;
    
    const searchParams = new URLSearchParams(location.search);
    const devModeParam = searchParams.get('dev_mode');
    
    if (devModeParam) {
      const validTypes: DevUserType[] = ['individual', 'establishment', 'promoter', 'admin'];
      if (validTypes.includes(devModeParam as DevUserType)) {
        const userType = devModeParam as DevUserType;
        console.log('useDevelopmentMode - Setting dev mode from URL parameter:', userType);
        switchToUserType(userType);
      }
    }
  }, [location.search, isInitialized]);

  const navigateToUserTypeDashboard = (userType: DevUserType) => {
    // Clean up URL parameters first
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('dev_mode');
    window.history.replaceState({}, '', newUrl.toString());

    console.log('useDevelopmentMode - Navigating to dashboard for:', userType);

    // Navigate to appropriate dashboard
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
    if (!isDevelopmentRef.current) {
      console.log('useDevelopmentMode - Not in development mode, ignoring user type switch');
      return;
    }
    
    console.log('useDevelopmentMode - Switching to user type:', userType);
    
    // Update both state and ref synchronously for immediate availability
    devModeRef.current = userType;
    setDevMode(userType);
    
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
      // Add small delay to ensure state is propagated before navigation
      setTimeout(() => {
        navigateToUserTypeDashboard(userType);
      }, 10);
    } else {
      localStorage.removeItem('dev_user_type');
      setTimeout(() => {
        navigate('/landing');
      }, 10);
    }
  };

  const exitDevMode = () => {
    console.log('useDevelopmentMode - Exiting dev mode');
    devModeRef.current = null;
    setDevMode(null);
    localStorage.removeItem('dev_user_type');
    navigate('/landing');
  };

  // Use refs for immediate state access, preventing race conditions
  const isDevModeActive = isDevelopmentRef.current && devModeRef.current !== null;
  
  console.log('useDevelopmentMode - Current state:', {
    isDevelopment: isDevelopmentRef.current,
    devMode: devModeRef.current,
    isDevModeActive,
    isInitialized,
    location: location.pathname
  });

  return {
    isDevelopment: isDevelopmentRef.current,
    devMode: devModeRef.current, // Return ref value for immediate access
    switchToUserType,
    exitDevMode,
    isDevModeActive,
    isInitialized
  };
};
