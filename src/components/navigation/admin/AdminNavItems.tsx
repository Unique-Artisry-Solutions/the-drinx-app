
import { Home, Users, Building2, LayoutDashboard, FileBarChart2, Image, Palette } from 'lucide-react';

export const adminNavItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Establishments',
    path: '/admin/establishments',
    icon: Building2,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    label: 'System Breakdown',
    path: '/admin/system-breakdown',
    icon: FileBarChart2,
  },
  {
    label: 'Photo Moderation',
    path: '/admin/photo-moderation',
    icon: Image,
  },
  {
    label: 'Theme Customization',
    path: '/admin/theme-customization',
    icon: Palette,
  }
];
