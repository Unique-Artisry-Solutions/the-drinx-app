
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import AdminProfileDropdown from './AdminProfileDropdown';
import AdminMobileMenu from './AdminMobileMenu';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';

const AdminTopNav: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string>('Admin');
  const { signOut } = useAuth();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('admin_username') || 'Admin';
    setAdminUsername(storedUsername);
    console.log('AdminTopNav rendered');
  }, []);
  
  const handleLogout = async () => {
    try {
      // Clear all auth data
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_session_created');
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('bypass_user_id');
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_username');
      
      // Call signOut to handle any backend cleanup
      await signOut();
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      
      // Force a complete page reload and navigation to landing page
      window.location.href = '/landing';
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem logging out',
        variant: 'destructive',
      });
      
      // Still attempt to redirect even if there's an error
      window.location.href = '/landing';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AnalyticsService pageView="admin_navigation">
      <nav className="admin-top-nav bg-material-primary text-white z-50 shadow-md h-16 w-full">
        <div className="admin-nav-container h-full w-full px-4">
          <div className="admin-nav-inner h-full flex items-center justify-between">
            <div className="admin-nav-left flex items-center">
              <Link to="/admin/dashboard" className="admin-nav-logo text-lg font-semibold mr-8">
                Spirit<span className="text-white">less</span>
              </Link>
            </div>
            
            <div className="admin-nav-right flex items-center space-x-4">
              <div className="hidden md:block text-sm text-white/80">
                <span className="font-medium text-white">{adminUsername}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
              >
                <Bell size={18} />
              </Button>
              
              <AdminProfileDropdown 
                username={adminUsername} 
                onLogout={handleLogout} 
              />
            </div>
          </div>
        </div>
      </nav>
    </AnalyticsService>
  );
};

export default AdminTopNav;
