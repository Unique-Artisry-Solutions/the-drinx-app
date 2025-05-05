
import React from 'react';
import { Home, User, Building2, Calendar, Users, Settings, BookOpen, BarChart3, MapPin } from 'lucide-react';

export interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

// Define static routes with their labels and icons
export const routes: Record<string, BreadcrumbConfig> = {
  '/': {
    path: '/',
    label: 'Home',
    icon: React.createElement(Home, { className: "h-4 w-4" })
  },
  '/explore': {
    path: '/explore',
    label: 'Explore',
    icon: React.createElement(MapPin, { className: "h-4 w-4" })
  },
  '/profile': {
    path: '/profile',
    label: 'Profile',
    icon: React.createElement(User, { className: "h-4 w-4" })
  },
  '/settings': {
    path: '/settings',
    label: 'Settings',
    icon: React.createElement(Settings, { className: "h-4 w-4" })
  },
  '/establishment/dashboard': {
    path: '/establishment/dashboard',
    label: 'Dashboard',
    icon: React.createElement(Building2, { className: "h-4 w-4" })
  },
  '/promoter/dashboard': {
    path: '/promoter/dashboard',
    label: 'Dashboard',
    icon: React.createElement(BarChart3, { className: "h-4 w-4" })
  },
  '/promoter/events': {
    path: '/promoter/events',
    label: 'Events',
    icon: React.createElement(Calendar, { className: "h-4 w-4" })
  },
  '/admin': {
    path: '/admin',
    label: 'Admin',
    icon: React.createElement(Settings, { className: "h-4 w-4" })
  },
  '/swig-circuits': {
    path: '/swig-circuits',
    label: 'Swig Circuits',
    icon: React.createElement(MapPin, { className: "h-4 w-4" })
  }
};

// Define dynamic routes that have ID parameters
export const dynamicRoutes = [
  {
    pattern: /^\/promoter\/events\/[a-zA-Z0-9-]+$/,
    base: '/promoter/events',
    label: 'Event Details',
    icon: React.createElement(Calendar, { className: "h-4 w-4" })
  },
  {
    pattern: /^\/establishment\/[a-zA-Z0-9-]+$/,
    base: '/establishment',
    label: 'Establishment'
  },
  {
    pattern: /^\/bar-crawl-details\/[a-zA-Z0-9-]+$/,
    base: '/swig-circuits',
    label: 'Bar Crawl'
  }
];
