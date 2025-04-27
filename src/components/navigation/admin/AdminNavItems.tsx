import { Home, Users, Building2, LayoutDashboard, FileBarChart2, Image, Palette, Layers, BookOpen, Settings, Bell, Activity, FileText } from 'lucide-react';

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
    label: 'Notifications',
    path: '/admin/notifications',
    icon: Bell,
    showInNav: true,
  },
  {
    label: 'Notification Testing',
    path: '/admin/notification-testing',
    icon: Bell,
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
    label: 'Reward System Monitor',
    path: '/admin/reward-system-monitor',
    icon: Activity,
    showInNav: true,
  },
  {
    label: 'Component Catalog',
    path: '/admin/component-catalog',
    icon: Layers,
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
  },
  {
    label: 'Documentation',
    path: '/admin/documentation',
    icon: BookOpen,
    showInNav: true,
  },
  {
    label: 'System Configuration',
    path: '/admin/system-configuration',
    icon: Settings,
    showInNav: true,
  },
  {
    label: 'Testing Interface',
    path: '/admin/testing',
    icon: FileText,
    showInNav: true,
  }
];
