
import { Home } from 'lucide-react';
import React from 'react';

export interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

// Comprehensive route mapping for the application
export const routes: Record<string, BreadcrumbConfig> = {
  '/': { path: '/', label: 'Home', icon: React.createElement(Home, { className: "h-4 w-4" }) },
  '/explore': { path: '/explore', label: 'Explore' },
  '/map': { path: '/map', label: 'Map' },
  
  // Profile section
  '/profile': { path: '/profile', label: 'Profile' },
  '/profile/bar-crawls': { path: '/profile/bar-crawls', label: 'Swig Circuits' },
  '/profile/recipes': { path: '/profile/recipes', label: 'My Recipes' },
  '/profile/favorites': { path: '/profile/favorites', label: 'Favorites' },
  '/profile/visited': { path: '/profile/visited', label: 'Visited' },
  '/profile/rewards': { path: '/profile/rewards', label: 'Rewards' },
  '/profile/my-creations': { path: '/profile/my-creations', label: 'My Creations' },
  '/profile/settings': { path: '/profile/settings', label: 'Settings' },
  
  // Swig Circuit related routes
  '/bar-crawl': { path: '/swig-circuits', label: 'Swig Circuits' },
  '/swig-circuits': { path: '/swig-circuits', label: 'Swig Circuits' },
  '/create-bar-crawl': { path: '/create-bar-crawl', label: 'Create Swig Circuit' },
  
  // Establishment routes - Update establishment route to point to dashboard
  '/establishment': { path: '/establishment/dashboard', label: 'Dashboard' },
  '/establishment/dashboard': { path: '/establishment/dashboard', label: 'Dashboard' },
  '/establishment/all-actions': { path: '/establishment/all-actions', label: 'All Actions' },
  '/establishment/profile': { path: '/establishment/profile', label: 'Profile' },
  '/establishment/mocktail-menu': { path: '/establishment/mocktail-menu', label: 'Mocktail Menu' },
  '/establishment/promotions': { path: '/establishment/promotions', label: 'Promotional Offers' },
  '/establishment/bar-crawl-requests': { path: '/establishment/bar-crawl-requests', label: 'Swig Circuit Requests' },
  '/establishment/analytics': { path: '/establishment/analytics', label: 'Analytics' },
  '/establishment/reviews': { path: '/establishment/reviews', label: 'Reviews' },
  '/establishment/mocktail-suggestions': { path: '/establishment/mocktail-suggestions', label: 'Suggestions' },
  
  // Promoter routes
  '/promoter': { path: '/promoter/dashboard', label: 'Dashboard' },
  '/promoter/dashboard': { path: '/promoter/dashboard', label: 'Dashboard' },
  '/promoter/analytics': { path: '/promoter/analytics', label: 'Analytics' },
  
  // Admin routes
  '/admin': { path: '/admin', label: 'Admin' },
  '/admin/users': { path: '/admin/users', label: 'Users Management' },
  '/admin/establishments': { path: '/admin/establishments', label: 'Establishments' },
  
  // Other pages
  '/settings': { path: '/settings', label: 'Settings' },
  '/mission': { path: '/mission', label: 'Our Mission' },
  '/resources': { path: '/resources', label: 'Resources' },
  '/pricing': { path: '/pricing', label: 'Pricing' },
};

// Dynamic path matching patterns
export const dynamicRoutes = [
  // Fixed these patterns to use the correct base path
  { pattern: /^\/bar-crawl\/(.+)$/, base: '/swig-circuits', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-profile\/(.+)$/, base: '/swig-circuits', label: 'Swig Circuit Details' },
  { pattern: /^\/bar-crawl-details\/(.+)$/, base: '/swig-circuits', label: 'Swig Circuit Details' },
  { pattern: /^\/establishment\/(\d+)$/, base: '/establishment/dashboard', label: 'Establishment Details' },
  { pattern: /^\/establishment\/mocktail\/(.+)$/, base: '/establishment/mocktail-menu', label: 'Mocktail Details' },
  { pattern: /^\/cocktail\/(.+)$/, base: '/cocktail', label: 'Cocktail Details' },
  { pattern: /^\/profile\/my-creations\/(.+)$/, base: '/profile/my-creations', label: 'Swig Circuit Management' },
  { pattern: /^\/admin\/users\/(.+)$/, base: '/admin/users', label: 'User Details' },
  { pattern: /^\/admin\/establishments\/(.+)$/, base: '/admin/establishments', label: 'Establishment Details' },
  { pattern: /^\/promoter\/analytics\/(.+)$/, base: '/promoter/analytics', label: 'Analytics Details' },
];
