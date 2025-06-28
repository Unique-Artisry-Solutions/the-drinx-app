
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { DevRoleSwitcher, AuthTestPanel } from '@/components/development';
import { publicRoutes } from '@/routes/config/publicRoutes';
import { individualRoutes } from '@/routes/config/individualRoutes';
import { profileRoutes } from '@/routes/config/profileRoutes';
import { adminRoutes } from '@/routes/config/adminRoutes';
import { promoterRoutes } from '@/routes/config/promoterRoutes';
import { establishmentRoutes } from '@/routes/config/establishmentRoutes';
import { testingRoutes } from '@/routes/testingRoutes';
import TestingAccess from '@/components/development/TestingAccess';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  const { isReady, isAuthenticated, userType } = useAuthenticatedUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isReady) {
      setIsInitialized(true);
    }
  }, [isReady]);

  if (!isInitialized) {
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
    <QueryClientProvider client={queryClient}>
      <DevelopmentModeProvider>
        <AuthProvider>
          <Router>
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
                  <Route key={index} path={route.path} element={route.element} />
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
              <AuthTestPanel />
              <TestingAccess />
            </div>
          </Router>
        </AuthProvider>
      </DevelopmentModeProvider>
    </QueryClientProvider>
  );
}

export default App;
