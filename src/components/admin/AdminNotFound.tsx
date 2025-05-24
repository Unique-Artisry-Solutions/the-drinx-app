
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Settings, Users, BarChart3 } from 'lucide-react';
import AdminLayout from '@/components/admin/layout/AdminLayout';

const AdminNotFound: React.FC = () => {
  const adminRoutes = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/system-configuration', label: 'System Settings', icon: Settings },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-4 text-spiritless-pink">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Admin Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The admin page you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {adminRoutes.map((route) => (
                <Button
                  key={route.path}
                  asChild
                  variant="outline"
                  className="justify-start"
                >
                  <Link to={route.path}>
                    <route.icon className="w-4 h-4 mr-2" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Button asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotFound;
