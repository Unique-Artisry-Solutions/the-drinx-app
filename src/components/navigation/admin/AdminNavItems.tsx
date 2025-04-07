
import { Home, Map, Plus, Globe, LayoutDashboard, Database, FileText, UserCheck, Building, Image } from 'lucide-react';

export interface AdminNavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  showInNav?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: UserCheck, label: 'Users', path: '/admin/users' },
  { icon: Building, label: 'Establishments', path: '/admin/establishments' },
  { icon: Database, label: 'System', path: '/admin/system-breakdown' },
  { icon: Image, label: 'Photos', path: '/admin/photo-moderation' },
  { icon: Home, label: 'Home', path: '/', showInNav: false },
  { icon: Map, label: 'Map', path: '/map', showInNav: false },
  { icon: Plus, label: 'Add', path: '/add', showInNav: false },
  { icon: Globe, label: 'Landing', path: '/landing', showInNav: false },
  { icon: FileText, label: 'Documentation', path: '/admin/documentation', showInNav: false },
];
