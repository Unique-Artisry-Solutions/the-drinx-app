
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  BarChart3, 
  Settings, 
  Flag, 
  Image, 
  Award,
  FileText,
  Database,
  Palette,
  TestTube,
  FolderTree
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Building, label: 'Establishments', path: '/admin/establishments' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Award, label: 'Rewards', path: '/admin/rewards' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Flag, label: 'Content Flags', path: '/admin/content-flags' },
  { icon: Image, label: 'Photo Moderation', path: '/admin/photo-moderation' },
  { icon: FileText, label: 'Documentation', path: '/admin/documentation' },
  { icon: Database, label: 'Database Health', path: '/admin/database-health' },
  { icon: FolderTree, label: 'System Breakdown', path: '/admin/system-breakdown' },
  { icon: Palette, label: 'Theme Management', path: '/admin/theme' },
  { icon: TestTube, label: 'Testing', path: '/admin/testing' },
  { icon: Settings, label: 'System Config', path: '/admin/system-config' },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
