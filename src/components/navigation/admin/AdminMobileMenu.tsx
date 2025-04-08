
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItem } from '@/components/ui/dropdown/dropdown-items';
import AdminNavItems from './AdminNavItems';
import { Users, Building, LineChart, Shield, FileText, Image, Cog, BarChart2 } from 'lucide-react';

export const AdminMobileMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-1">
      {navItems.map((item) => (
        <MenuItem
          key={item.to}
          onClick={() => navigate(item.to)}
          icon={item.icon}
          active={location.pathname === item.to}
        >
          {item.label}
        </MenuItem>
      ))}
    </div>
  );
};
