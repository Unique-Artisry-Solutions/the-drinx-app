import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { DevelopmentModeProvider } from '@/contexts/DevelopmentModeContext';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { DevRoleSwitcher } from '@/components/development';
import { AuthTestPanel } from '@/components/development';
import { landingRoutes } from '@/routes/landingRoutes';
import { exploreRoutes } from '@/routes/exploreRoutes';
import { authRoutes } from '@/routes/authRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import { promoterRoutes } from '@/routes/promoterRoutes';
import { establishmentRoutes } from '@/routes/establishmentRoutes';
import { testingRoutes } from '@/routes/testingRoutes';
import TestingAccess from '@/components/development/TestingAccess';

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
    <QueryClient>
      <DevelopmentModeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Routes>
                {/* Public Routes */}
                {landingRoutes}
                {exploreRoutes}
                {authRoutes}

                {/* Admin Routes */}
                {adminRoutes}

                {/* Promoter Routes */}
                {promoterRoutes}

                {/* Establishment Routes */}
                {establishmentRoutes}
                
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
    </QueryClient>
  );
}

export default App;
