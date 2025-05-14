
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { adminNavItems, flatAdminNavItems } from './AdminNavItems';
import AdminProfileDropdown from './AdminProfileDropdown';
import AdminMobileMenu from './AdminMobileMenu';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

const AdminTopNav: React.FC = () => {
  const location = useLocation();
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

  const isActive = (path: string) => {
    // Return true if the exact path matches or if it's a parent path of the current location
    return location.pathname === path || 
      (path !== '/admin/dashboard' && location.pathname.startsWith(path));
  };

  // Find the active item from flat list
  const activeNavItem = flatAdminNavItems.find(item => 
    isActive(item.path) && item.showInNav && !item.children
  );

  // Find the active category (parent item)
  const activeCategory = adminNavItems.find(category =>
    category.children?.some(child => isActive(child.path))
  );

  // Display name would be the active item's label, or if it's a child, show "Category > Child"
  const displayName = activeNavItem ? 
    (activeCategory && activeNavItem.path !== activeCategory.path ? 
      `${activeCategory.label} > ${activeNavItem.label}` : 
      activeNavItem.label) : 
    'Dashboard';

  const displayIcon = activeNavItem ? 
    activeNavItem.icon : 
    (activeCategory ? activeCategory.icon : adminNavItems[0].icon);

  return (
    <AnalyticsService pageView="admin_navigation">
      <nav className="admin-top-nav fixed top-0 left-0 w-full bg-material-primary text-white z-50 shadow-md">
        <div className="admin-nav-container max-w-7xl mx-auto px-4 py-2">
          <div className="admin-nav-inner flex items-center justify-between">
            <div className="admin-nav-left flex items-center">
              <Link to="/" className="admin-nav-logo text-lg font-semibold mr-8">
                Spirit<span className="text-white">less</span>
              </Link>
              
              <div className="admin-nav-links hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/20 flex items-center gap-2 min-w-44"
                    >
                      <displayIcon className="h-4 w-4" />
                      <span className="text-sm font-medium truncate">{displayName}</span>
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white text-gray-800 w-64">
                    {adminNavItems.map((category) => (
                      <React.Fragment key={category.path}>
                        {category.children ? (
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-medium text-sm">
                              <div className="flex items-center">
                                <category.icon className="mr-2 h-4 w-4 text-gray-600" />
                                <span>{category.label}</span>
                              </div>
                            </DropdownMenuLabel>
                            {category.children.map((item) => (
                              <DropdownMenuItem key={item.path} asChild>
                                <Link
                                  to={item.path}
                                  className={`flex items-center px-3 py-2 rounded-md w-full ml-4 ${
                                    isActive(item.path) ? 'bg-gray-100' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <item.icon className="mr-2 h-4 w-4" />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        ) : (
                          <DropdownMenuItem key={category.path} asChild>
                            <Link
                              to={category.path}
                              className={`flex items-center px-3 py-2 rounded-md w-full ${
                                isActive(category.path) ? 'bg-gray-100' : 'hover:bg-gray-50'
                              }`}
                            >
                              <category.icon className="mr-2 h-4 w-4" />
                              <span className="text-sm font-medium">{category.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {/* Add separator after each category except the last one */}
                        {adminNavItems.indexOf(category) < adminNavItems.length - 1 && (
                          <DropdownMenuSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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

