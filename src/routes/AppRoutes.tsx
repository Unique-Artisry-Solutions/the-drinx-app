
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { publicRoutes } from './config/publicRoutes';
import { individualRoutes } from './config/individualRoutes';
import PageSuspense from '@/components/loading/PageSuspense';
import { useNavigationTracking } from '@/utils/lazyRouteLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Import the EventScannerPage component
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));
// Import the EventDetailPage component 
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
// Import the BarCrawlDetail component
const BarCrawlDetail = React.lazy(() => import('@/pages/BarCrawlDetail'));

const AppRoutes = () => {
  // Track navigation for prefetching optimization
  useNavigationTracking();
  const location = useLocation();

  // Add debugging for route resolution
  console.log('AppRoutes: Current location', location.pathname);
  console.log('AppRoutes: Admin routes count', adminRoutes.length);
  
  return (
    <PageSuspense>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes - includes the /404 route */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Individual User Routes */}
          {individualRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Ensure we have a direct route for event details */}
          <Route 
            path="/event/:id" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <EventDetailPage />
              </PageSuspense>
            } 
          />
          
          {/* Add direct route for bar crawl details */}
          <Route 
            path="/bar-crawl/:id" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <BarCrawlDetail />
              </PageSuspense>
            }
          />

          {/* Special public route for event scanner that requires token */}
          <Route 
            path="/events/scan/:eventId/:token" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <EventScannerPage />
              </PageSuspense>
            }
          />

          {/* Admin Routes - must come before the catch-all to ensure admin/* routes are matched properly */}
          {adminRoutes.map((route, index) => {
            console.log(`AppRoutes: Registering admin route ${index}:`, route.path);
            return <Route key={route.path} path={route.path} element={route.element}>
              {route.children && route.children.map((childRoute, childIndex) => (
                <Route 
                  key={childRoute.path || 'index'} 
                  path={childRoute.path} 
                  index={childRoute.index}
                  element={childRoute.element} 
                />
              ))}
            </Route>
          })}

          {/* Establishment Routes */}
          {establishmentRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Promoter Routes */}
          {promoterRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Profile Routes */}
          {profileRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </PageSuspense>
  );
};

export default AppRoutes;
