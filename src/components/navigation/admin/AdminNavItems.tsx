
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, LineChart, Shield, FileText, Image, Cog, BarChart2 } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-primary transition-all'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

interface AdminNavItemsProps {
  currentPath: string;
}

const AdminNavItems: React.FC<AdminNavItemsProps> = ({ currentPath }) => {
  const navItems = [
    {
      to: '/admin/dashboard',
      icon: <LineChart className="h-4 w-4" />,
      label: 'Dashboard',
    },
    {
      to: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      label: 'Users',
    },
    {
      to: '/admin/establishments',
      icon: <Building className="h-4 w-4" />,
      label: 'Establishments',
    },
    {
      to: '/admin/system-breakdown',
      icon: <FileText className="h-4 w-4" />,
      label: 'System Breakdown',
    },
    {
      to: '/admin/content-moderation',
      icon: <Shield className="h-4 w-4" />,
      label: 'Content Moderation',
    },
    {
      to: '/admin/photo-moderation',
      icon: <Image className="h-4 w-4" />,
      label: 'Photo Moderation',
    },
    {
      to: '/admin/system-settings',
      icon: <Cog className="h-4 w-4" />,
      label: 'System Settings',
    },
    {
      to: '/admin/analytics',
      icon: <BarChart2 className="h-4 w-4" />,
      label: 'Analytics',
    },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={currentPath === item.to}
        />
      ))}
    </nav>
  );
};

export default AdminNavItems;
