
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Store, 
  Settings, 
  Image, 
  AlertTriangle,
  BarChart2,
  Cog 
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export const adminNavItems: AdminNavItem[] = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/establishments',
    label: 'Establishments',
    icon: Store,
  },
  {
    href: '/admin/system-breakdown',
    label: 'System Breakdown',
    icon: Settings,
  },
  {
    href: '/admin/system-configuration',
    label: 'System Configuration',
    icon: Cog,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart2,
  },
  {
    href: '/admin/photo-moderation',
    label: 'Photo Moderation',
    icon: Image,
  },
  {
    href: '/admin/content-moderation',
    label: 'Content Moderation',
    icon: AlertTriangle,
  },
];

interface AdminNavItemsProps {
  currentPath: string;
}

const AdminNavItems: React.FC<AdminNavItemsProps> = ({ currentPath }) => {
  return (
    <nav className="flex flex-1">
      <ul className="flex space-x-2">
        {adminNavItems.map((item) => {
          const isActive = currentPath.startsWith(item.href);
          return (
            <li key={item.href}>
              <NavLink 
                to={item.href} 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  }`
                }
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNavItems;
