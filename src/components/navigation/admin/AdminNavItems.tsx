
import React from 'react';
import { 
  Users, 
  Building, 
  LineChart, 
  Settings, 
  Shield, 
  Image, 
  Cog, 
  BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AdminNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const adminNavItems: AdminNavItemProps[] = [
  {
    to: '/admin/dashboard',
    icon: <LineChart className="h-5 w-5" />,
    label: 'Dashboard'
  },
  {
    to: '/admin/users',
    icon: <Users className="h-5 w-5" />,
    label: 'Users'
  },
  {
    to: '/admin/establishments',
    icon: <Building className="h-5 w-5" />,
    label: 'Establishments'
  },
  {
    to: '/admin/system-breakdown',
    icon: <Settings className="h-5 w-5" />,
    label: 'System Breakdown'
  },
  {
    to: '/admin/content-moderation',
    icon: <Shield className="h-5 w-5" />,
    label: 'Content Moderation'
  },
  {
    to: '/admin/photo-moderation',
    icon: <Image className="h-5 w-5" />,
    label: 'Photo Moderation'
  },
  {
    to: '/admin/system-settings',
    icon: <Cog className="h-5 w-5" />,
    label: 'System Settings'
  },
  {
    to: '/admin/analytics',
    icon: <BarChart2 className="h-5 w-5" />,
    label: 'Analytics'
  }
];

interface AdminNavItemsProps {
  currentPath: string;
}

const AdminNavItems: React.FC<AdminNavItemsProps> = ({ currentPath }) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex space-x-4">
      {adminNavItems.map((item) => (
        <button
          key={item.to}
          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
            currentPath === item.to
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
          onClick={() => navigate(item.to)}
        >
          <span className="mr-2">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AdminNavItems;
export { adminNavItems };
