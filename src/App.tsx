
import React, { useEffect, useState } from 'react';
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
import ImpersonationBanner from '@/components/auth/ImpersonationBanner';
import { initDebug } from '@/utils/initDebug';

const App: React.FC = () => {
  const { isReady, isAuthenticated, userType, isLoading, authStable } = useAuthenticatedUser();
  const [forceReady, setForceReady] = useState(false);

  initDebug.log('App render', { isReady, isAuthenticated, userType, isLoading, authStable, forceReady });

  // Timeout mechanism to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isReady && !forceReady) {
        initDebug.warn('App loading timeout - forcing ready state');
        setForceReady(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeoutId);
  }, [isReady, forceReady]);

  // Use forceReady if timeout has passed or isReady is true
  const effectiveIsReady = isReady || forceReady;

  if (!effectiveIsReady) {
    initDebug.log('App loading screen shown', { forceReady });
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {forceReady ? 'Starting app...' : 'Loading...'}
          </p>
          {forceReady && (
            <p className="mt-2 text-xs text-gray-500">Taking longer than expected</p>
          )}
        </div>
      </div>
    );
  }

  initDebug.log('App routes rendered');
  return (
    <div className="min-h-screen bg-white">
      {/* Global impersonation banner */}
      <ImpersonationBanner />
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
  );
};

export default App;
