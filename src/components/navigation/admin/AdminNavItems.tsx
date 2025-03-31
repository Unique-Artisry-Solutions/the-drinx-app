
import { Home, Map, Plus, Globe, LayoutDashboard } from 'lucide-react';

export interface AdminNavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

export const adminNavItems: AdminNavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Map, label: 'Map', path: '/map' },
  { icon: Plus, label: 'Add', path: '/add' },
  { icon: Globe, label: 'Landing', path: '/landing' },
  { icon: LayoutDashboard, label: 'Admin', path: '/admin/dashboard' },
];
