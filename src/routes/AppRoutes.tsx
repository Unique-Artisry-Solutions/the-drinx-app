
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import { profileRoutes } from './config/profileRoutes';
import { simplifiedPublicRoutes } from './config/simplifiedPublicRoutes';
import { individualRoutes } from './config/individualRoutes';
import PageSuspense from '@/components/loading/PageSuspense';
import { useNavigationTracking } from '@/utils/lazyRouteLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Only lazy load complex pages that actually benefit from it
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
const BarCrawlDetail = React.lazy(() => import('@/pages/BarCrawlDetail'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const PurchaseSuccessPage = React.lazy(() => import('@/pages/PurchaseSuccessPage'));
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));

const AppRoutes = () => {
  useNavigationTracking();
  const location = useLocation();

  return (
    <PageSuspense>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Simplified Public Routes - No lazy loading */}
          {simplifiedPublicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Simplified Individual User Routes - Direct rendering */}
          {individualRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Commerce Routes - Keep lazy loading for heavy pages */}
          <Route 
            path="/checkout" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <CheckoutPage />
              </PageSuspense>
            } 
          />
          
          <Route 
            path="/purchase-success" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <PurchaseSuccessPage />
              </PageSuspense>
            } 
          />

          {/* Event Routes - Keep lazy loading for complex functionality */}
          <Route 
            path="/event/:id" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <EventDetailPage />
              </PageSuspense>
            } 
          />
          
          <Route 
            path="/bar-crawl/:id" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <BarCrawlDetail />
              </PageSuspense>
            }
          />

          <Route 
            path="/events/scan/:eventId/:token" 
            element={
              <PageSuspense fallback={<Skeleton className="h-screen w-full" />}>
                <EventScannerPage />
              </PageSuspense>
            }
          />

          {/* Admin Routes - Keep complex structure */}
          {adminRoutes.map((route, index) => (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children && route.children.map((childRoute, childIndex) => (
                <Route 
                  key={childRoute.path || 'index'} 
                  path={childRoute.path} 
                  index={childRoute.index}
                  element={childRoute.element} 
                />
              ))}
            </Route>
          ))}

          {/* Other Protected Routes - Keep existing structure */}
          {establishmentRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {promoterRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {profileRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </PageSuspense>
  );
};

export default AppRoutes;
