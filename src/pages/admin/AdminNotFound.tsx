
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const AdminNotFound: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-gray-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Admin Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The admin page you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/admin/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotFound;
