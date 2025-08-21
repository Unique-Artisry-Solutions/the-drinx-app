import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { DevRoleSwitcher } from '@/components/development';
import { publicRoutes } from '@/routes/config/publicRoutes';
import { individualRoutes } from '@/routes/config/individualRoutes';
import { profileRoutes } from '@/routes/config/profileRoutes';
import { adminRoutes } from '@/routes/config/adminRoutes';
import { promoterRoutes } from '@/routes/config/promoterRoutes';
import { establishmentRoutes } from '@/routes/config/establishmentRoutes';
import { testingRoutes } from '@/routes/testingRoutes';
import MagicLinkHandler from '@/components/auth/MagicLinkHandler';
import AppProviders from '@/components/providers/AppProviders';
import { initDebug } from '@/utils/initDebug';

const App: React.FC = () => {
  const { 
    isReady, 
    isAuthenticated, 
    userType, 
    isLoading, 
    authStable, 
    authStateStable, 
    isTransitioning 
  } = useAuthenticatedUser();
  
  const [timeoutExceeded, setTimeoutExceeded] = useState(false);

  initDebug.log('App render', { 
    isReady, 
    isAuthenticated, 
    userType, 
    isLoading, 
    authStable, 
    authStateStable, 
    isTransitioning,
    timeoutExceeded 
  });

  // Enhanced timeout mechanism with DevTools bypass
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isReady && !timeoutExceeded) {
        initDebug.warn('App loading timeout exceeded - enabling fallback');
        setTimeoutExceeded(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeoutId);
  }, [isReady, timeoutExceeded]);

  // Enhanced app readiness check with DevTools bypass
  const isAppReady = useMemo(() => {
    const basic = authStable && !isLoading;
    
    // For DevTools flows, use simplified readiness check
    const isDevToolsLogin = localStorage.getItem('dev_auto_login_user_type');
    if (isDevToolsLogin) {
      initDebug.log('DevTools app readiness check:', {
        authStable,
        isLoading,
        isAuthenticated,
        basic,
        isDevToolsLogin,
        timeoutExceeded
      });
      return basic || timeoutExceeded;
    }
    
    // For authenticated users, also check authStateStable
    const fullReady = isAuthenticated ? (basic && authStateStable && !isTransitioning) : basic;
    
    initDebug.log('Standard app readiness check:', {
      authStable,
      authStateStable,
      isLoading,
      isAuthenticated,
      isTransitioning,
      basic,
      fullReady,
      timeoutExceeded
    });
    
    return fullReady || timeoutExceeded;
  }, [authStable, authStateStable, isLoading, isAuthenticated, isTransitioning, timeoutExceeded]);

  if (!isAppReady) {
    initDebug.log('App loading screen shown', { timeoutExceeded });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {timeoutExceeded ? 'Starting app...' : 'Loading...'}
          </p>
          {timeoutExceeded && (
            <p className="mt-2 text-xs text-gray-500">Taking longer than expected</p>
          )}
        </div>
      </div>
    );
  }

  initDebug.log('App routes rendered');
  return (
    <MagicLinkHandler>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Individual User Routes */}
          {individualRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Profile Routes */}
          {profileRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Admin Routes */}
          {adminRoutes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={route.element}
            >
              {route.children?.map((childRoute, childIndex) => (
                <Route 
                  key={childIndex}
                  path={childRoute.path}
                  index={childRoute.index}
                  element={childRoute.element}
                />
              ))}
            </Route>
          ))}

          {/* Promoter Routes */}
          {promoterRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Establishment Routes */}
          {establishmentRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          
          {/* Testing Routes */}
          {testingRoutes}

          {/* Fallback Route - Redirect based on user type */}
          <Route path="*" element={<Navigate to={
            isAuthenticated ?
              (userType === 'admin' ? '/admin/system-breakdown' :
                (userType === 'establishment' ? '/establishment/dashboard' :
                  (userType === 'promoter' ? '/promoter/dashboard' : '/explore'))) :
              '/landing'} replace />} />
        </Routes>
    
        {/* Development Tools */}
        <DevRoleSwitcher />
      </div>
    </MagicLinkHandler>
  );
};

export default App;