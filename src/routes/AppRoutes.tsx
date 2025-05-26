
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

// Lazy loaded special pages
const EventScannerPage = React.lazy(() => import('@/pages/events/EventScannerPage'));
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
const BarCrawlDetail = React.lazy(() => import('@/pages/BarCrawlDetail'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const PurchaseSuccessPage = React.lazy(() => import('@/pages/PurchaseSuccessPage'));

const AppRoutes = () => {
  useNavigationTracking();
  const location = useLocation();

  return (
    <PageSuspense>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Individual User Routes (includes /explore) */}
          {individualRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Checkout Routes */}
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

          {/* Special Routes */}
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

          {/* Admin Routes */}
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
