
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { publicRoutes } from './config/publicRoutes';
import PageSuspense from '@/components/loading/PageSuspense';
import { useNavigationTracking } from '@/utils/lazyRouteLoader';
import { Skeleton } from '@/components/ui/skeleton';

// Import the EventScannerPage component
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));
// Import the EventDetailPage component 
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
// Import the BarCrawlDetail component
const BarCrawlDetail = React.lazy(() => import('@/pages/BarCrawlDetail'));

const AppRoutes = () => {
  // Track navigation for prefetching optimization
  useNavigationTracking();

  return (
    <PageSuspense>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
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

        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

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
    </PageSuspense>
  );
};

export default AppRoutes;
