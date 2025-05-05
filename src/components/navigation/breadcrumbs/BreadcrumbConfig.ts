
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
    icon: <Home className="h-4 w-4" />
  },
  '/explore': {
    path: '/explore',
    label: 'Explore',
    icon: <MapPin className="h-4 w-4" />
  },
  '/profile': {
    path: '/profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />
  },
  '/settings': {
    path: '/settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />
  },
  '/establishment/dashboard': {
    path: '/establishment/dashboard',
    label: 'Dashboard',
    icon: <Building2 className="h-4 w-4" />
  },
  '/promoter/dashboard': {
    path: '/promoter/dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="h-4 w-4" />
  },
  '/promoter/events': {
    path: '/promoter/events',
    label: 'Events',
    icon: <Calendar className="h-4 w-4" />
  },
  '/admin': {
    path: '/admin',
    label: 'Admin',
    icon: <Settings className="h-4 w-4" />
  },
  '/swig-circuits': {
    path: '/swig-circuits',
    label: 'Swig Circuits',
    icon: <MapPin className="h-4 w-4" />
  }
};

// Define dynamic routes that have ID parameters
export const dynamicRoutes = [
  {
    pattern: /^\/promoter\/events\/[a-zA-Z0-9-]+$/,
    base: '/promoter/events',
    label: 'Event Details',
    icon: <Calendar className="h-4 w-4" />
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
