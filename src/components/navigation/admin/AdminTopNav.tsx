
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { adminNavItems } from './AdminNavItems';
import AdminProfileDropdown from './AdminProfileDropdown';
import AdminMobileMenu from './AdminMobileMenu';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';

const AdminTopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string>('Admin');
  const { signOut } = useAuth();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('admin_username') || 'Admin';
    setAdminUsername(storedUsername);
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut();
      
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_username');
      localStorage.removeItem('user_type');
      localStorage.removeItem('admin_username');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem logging out',
        variant: 'destructive',
      });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path === '/admin/dashboard' && location.pathname.startsWith('/admin'));
  };

  return (
    <AnalyticsService pageView="admin_navigation">
      <nav className="admin-top-nav fixed top-0 left-0 w-full bg-material-primary text-white z-50 shadow-md">
        <div className="admin-nav-container max-w-6xl mx-auto px-4 py-2">
          <div className="admin-nav-inner flex items-center justify-between">
            <div className="admin-nav-left flex items-center">
              <Link to="/" className="admin-nav-logo text-lg font-semibold mr-6">
                Spirit<span className="text-white">less</span>
              </Link>
              
              <div className="admin-nav-links hidden md:flex space-x-1">
                {adminNavItems.filter(item => item.showInNav !== false).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-link px-3 py-1.5 rounded-md flex items-center transition-colors ${
                      isActive(item.path) ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="mr-1.5 h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="admin-nav-right flex items-center space-x-3">
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
              
              <Button 
                variant="outline" 
                size="icon" 
                className="admin-menu-button md:hidden text-white border-white hover:bg-white/20"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
              
              <AdminProfileDropdown 
                username={adminUsername} 
                onLogout={handleLogout} 
              />
            </div>
          </div>
          
          <AdminMobileMenu 
            isOpen={isMobileMenuOpen}
            username={adminUsername}
            navItems={adminNavItems}
            onItemClick={closeMobileMenu}
            onLogout={handleLogout}
          />
        </div>
      </nav>
    </AnalyticsService>
  );
};

export default AdminTopNav;
