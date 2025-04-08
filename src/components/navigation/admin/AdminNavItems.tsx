
import React from 'react';
import { Home, Store, Users, Image, Flag, Layers, BarChart } from 'lucide-react';
import NavItem from '@/components/navigation/NavItem';
import { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  showInNav?: boolean;
}

// Export the admin navigation items array for use in other components
export const adminNavItems: AdminNavItem[] = [
  { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin/establishments', icon: Store, label: 'Establishments' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/photo-moderation', icon: Image, label: 'Photo Moderation' },
  { path: '/admin/content-moderation', icon: Flag, label: 'Content Moderation' },
  { path: '/admin/system-breakdown', icon: Layers, label: 'System Breakdown' },
  { path: '/admin/analytics', icon: BarChart, label: 'Analytics' },
];

const AdminNavItems = () => {
  return (
    <>
      <NavItem href="/admin/dashboard" icon={Home} label="Dashboard" />
      <NavItem href="/admin/establishments" icon={Store} label="Establishments" />
      <NavItem href="/admin/users" icon={Users} label="Users" />
      <NavItem href="/admin/photo-moderation" icon={Image} label="Photo Moderation" />
      <NavItem href="/admin/content-moderation" icon={Flag} label="Content Moderation" />
      <NavItem href="/admin/system-breakdown" icon={Layers} label="System Breakdown" />
      <NavItem href="/admin/analytics" icon={BarChart} label="Analytics" />
    </>
  );
};

export default AdminNavItems;
