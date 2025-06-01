
import { Shield, BarChart3, Users, Settings, Award } from 'lucide-react';

export interface AdminNavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  showInNav?: boolean;
  children?: AdminNavItem[];
}

export const adminNavItems: AdminNavItem[] = [
  {
    path: '/admin/system-breakdown',
    label: 'System Overview',
    icon: Shield,
    showInNav: true
  },
  {
    path: '/admin/rewards',
    label: 'Rewards Admin',
    icon: Award,
    showInNav: true
  },
  {
    path: '/admin/rewards/monitor',
    label: 'System Monitor',
    icon: BarChart3,
    showInNav: true
  },
  {
    path: '/admin/users',
    label: 'User Management',
    icon: Users,
    showInNav: true
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    showInNav: true
  }
];
