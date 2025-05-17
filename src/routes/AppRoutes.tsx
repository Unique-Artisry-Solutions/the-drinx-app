
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import { PageSuspense } from '@/components/loading/PageSuspense';
import Loading from '@/components/ui/loading';
import { profileRoutes } from './config/profileRoutes';
import { adminRoutes } from './config/adminRoutes';
import { establishmentRoutes } from './config/establishmentRoutes';
import { promoterRoutes } from './config/promoterRoutes';
import NotFound from '@/pages/NotFound';
import CocktailDetail from '@/pages/CocktailDetail';
import EstablishmentDetail from '@/pages/EstablishmentDetail';
import SwigCircuitsPage from '@/pages/SwigCircuitsPage';
import EventsPage from '@/pages/EventsPage';

// Create a simple loading component for use with PageSuspense
const PageLoader = () => <Loading className="h-screen" />;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Main app routes */}
      <Route 
        path="/home" 
        element={
          <PageSuspense fallback={<PageLoader />}>
            <HomePage />
          </PageSuspense>
        } 
      />
      
      <Route 
        path="/explore" 
        element={
          <PageSuspense fallback={<PageLoader />}>
            <ExplorePage />
          </PageSuspense>
        } 
      />
      
      <Route 
        path="/cocktail/:id" 
        element={
          <PageSuspense fallback={<PageLoader />}>
            <CocktailDetail />
          </PageSuspense>
        } 
      />
      
      <Route path="/establishment/:id" element={<EstablishmentDetail />} />
      <Route path="/swig-circuits" element={<SwigCircuitsPage />} />
      <Route path="/events" element={<EventsPage />} />
      
      {/* User profile routes */}
      {profileRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
      
      {/* Admin routes */}
      {adminRoutes.map((route) => (
        <Route 
          key={route.path}
          path={route.path}
          element={route.element} 
        />
      ))}
      
      {/* Establishment routes */}
      {establishmentRoutes.map((route) => (
        <Route 
          key={route.path}
          path={route.path}
          element={route.element} 
        />
      ))}
      
      {/* Promoter routes */}
      {promoterRoutes.map((route) => (
        <Route 
          key={route.path}
          path={route.path}
          element={route.element} 
        />
      ))}
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
