
import React from 'react';
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

const App: React.FC = () => {
  const { isReady, isAuthenticated, userType } = useAuthenticatedUser();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
