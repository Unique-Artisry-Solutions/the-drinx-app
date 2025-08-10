
import { 
  Home, Users, Building2, LayoutDashboard, FileBarChart2, Image, 
  Palette, Layers, BookOpen, Settings, Bell, Activity, Award, 
  FileText, Shield, TestTube
} from 'lucide-react';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

// Simplified admin navigation structure
export const adminNavItems: UnifiedNavItem[] = [
  {
    label: 'System Overview',
    path: '/admin/system-breakdown',
    icon: Shield,
    showInNav: true,
  },
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    showInNav: true,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    showInNav: true,
  },
  {
    label: 'Establishments',
    path: '/admin/establishments',
    icon: Building2,
    showInNav: true,
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: FileBarChart2,
    showInNav: true,
  },
  {
    label: 'Logs & Alerts',
    path: '/admin/logs',
    icon: Activity,
    showInNav: true,
  },
  {
    label: 'Notifications',
    path: '/admin/notifications',
    icon: Bell,
    showInNav: true,
  },
  {
    label: 'Content Moderation',
    path: '/admin/content-moderation',
    icon: Image,
    showInNav: true,
  },
  {
    label: 'Rewards',
    path: '/admin/rewards',
    icon: Award,
    showInNav: true,
  },
  {
    label: 'Testing Dashboard',
    path: '/admin/testing-dashboard',
    icon: TestTube,
    showInNav: true,
  },
  {
    label: 'Configuration',
    path: '/admin/system-configuration',
    icon: Settings,
    showInNav: true,
  },
  {
    label: 'Tools',
    path: '/admin/component-catalog',
    icon: Layers,
    showInNav: true,
  }
];

// Flat list for compatibility
export const flatAdminNavItems: UnifiedNavItem[] = adminNavItems;
