
import React from 'react';
import { Shield } from 'lucide-react';

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-auto py-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium text-sm">Spiritless Admin</span>
          </div>
          <div className="text-xs text-gray-500">
            © {currentYear} Spiritless Admin Portal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
