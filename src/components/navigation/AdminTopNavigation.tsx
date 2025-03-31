import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Map, 
  Plus, 
  ShoppingCart, 
  User, 
  Settings, 
  LogOut,
  Globe,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartButton from '@/components/cart/CartButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminTopNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState<string>('Admin');
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('admin_username') || 'Admin';
    setAdminUsername(storedUsername);
  }, []);
  
  const handleLogout = () => {
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
  };

  const adminNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
    { icon: Globe, label: 'Landing', path: '/landing' },
    { icon: LayoutDashboard, label: 'Admin', path: '/admin/dashboard' },
  ];

  return (
    <nav className="admin-top-nav fixed top-0 left-0 w-full bg-material-primary text-white z-50 shadow-md">
      <div className="admin-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="admin-nav-inner flex items-center justify-between">
          <div className="admin-nav-left flex items-center">
            <Link to="/" className="admin-nav-logo text-xl font-semibold mr-6">
              Spirit<span className="text-white">less</span>
            </Link>
            
            <div className="admin-nav-links hidden md:flex space-x-1">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path === '/admin/dashboard' && location.pathname.startsWith('/admin'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-link px-3 py-2 rounded-md flex items-center ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="admin-nav-right flex items-center space-x-4">
            <div className="hidden md:block text-sm text-white/80 mr-2">
              Welcome, <span className="font-medium text-white">{adminUsername}</span>
            </div>
            
            <CartButton />
            
            <Button 
              variant="outline" 
              size="icon" 
              className="admin-menu-button md:hidden text-white border-white hover:bg-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="admin-profile-button border-white text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="admin-profile-dropdown w-56">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground md:hidden">
                  Welcome, {adminUsername}
                </div>
                <DropdownMenuSeparator className="md:hidden" />
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard" className="admin-profile-item flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="admin-profile-item flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="admin-logout-item flex items-center gap-2 text-red-600 cursor-pointer focus:text-red-700 focus:bg-red-50" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="admin-mobile-menu md:hidden py-3 space-y-2 animate-fade-in">
            <div className="text-sm text-white/80 px-3 py-2">
              Welcome, <span className="font-medium text-white">{adminUsername}</span>
            </div>
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/admin/dashboard' && location.pathname.startsWith('/admin'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-mobile-link block px-3 py-2 rounded-md ${
                    isActive ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <button
              className="flex items-center w-full px-3 py-2 text-red-200 hover:bg-red-800/30 rounded-md"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminTopNavigation;
