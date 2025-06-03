
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-auto py-4 bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-4 w-4 mr-2 text-material-primary" />
            <span className="font-medium text-sm">
              the Drinx app Admin
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link to="/admin/documentation" className="text-slate-400 hover:text-material-primary transition-colors">
              Documentation
            </Link>
            <Link to="/admin/system-breakdown" className="text-slate-400 hover:text-material-primary transition-colors">
              System Status
            </Link>
            <Link to="/admin/analytics" className="text-slate-400 hover:text-material-primary transition-colors">
              Analytics
            </Link>
          </div>
        </div>
        
        <Separator className="my-3 bg-slate-700" />
        
        <div className="text-xs text-center text-slate-500">
          <p>© {currentYear} Spiritless Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
