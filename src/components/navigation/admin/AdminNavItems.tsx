
import { Home, Users, Building2, LayoutDashboard, FileBarChart2, Image, Palette } from 'lucide-react';

type AdminNavItem = {
  label: string;
  path: string;
  icon: typeof Home;
  showInNav: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    showInNav: true,
  },
  {
    label: 'Establishments',
    path: '/admin/establishments',
    icon: Building2,
    showInNav: true,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    showInNav: true,
  },
  {
    label: 'System Breakdown',
    path: '/admin/system-breakdown',
    icon: FileBarChart2,
    showInNav: true,
  },
  {
    label: 'Photo Moderation',
    path: '/admin/photo-moderation',
    icon: Image,
    showInNav: true,
  },
  {
    label: 'Theme Customization',
    path: '/admin/theme-customization',
    icon: Palette,
    showInNav: true,
  }
];
