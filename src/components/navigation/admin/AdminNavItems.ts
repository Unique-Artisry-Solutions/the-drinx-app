
import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  Gift,
  Database,
  Bell,
  FileText,
  Layers,
  TestTube
} from 'lucide-react';

export interface EnhancedNavItemData {
  path: string;
  label: string;
  icon?: any;
  showInNav?: boolean;
  children?: EnhancedNavItemData[];
}

export const adminNavItems: EnhancedNavItemData[] = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
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
    path: '/admin/rewards',
    label: 'Rewards System',
    icon: Gift,
    showInNav: true
  },
  {
    path: '/admin/system-breakdown',
    label: 'System Breakdown',
    icon: Layers,
    showInNav: true
  },
  {
    path: '/admin/database',
    label: 'Database Health',
    icon: Database,
    showInNav: true
  },
  {
    path: '/admin/notifications',
    label: 'Notifications',
    icon: Bell,
    showInNav: true
  },
  {
    path: '/admin/reports',
    label: 'Reports',
    icon: FileText,
    showInNav: true
  },
  {
    path: '/admin/testing',
    label: 'Testing Suite',
    icon: TestTube,
    showInNav: true
  },
  {
    path: '/admin/settings',
    label: 'System Settings',
    icon: Settings,
    showInNav: true
  },
  {
    path: '/admin/security',
    label: 'Security',
    icon: Shield,
    showInNav: true
  }
];
