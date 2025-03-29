
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  X
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

const AdminTopNavigation: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_type');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    
    window.location.href = '/';
  };

  const adminNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
    { icon: Globe, label: 'Landing', path: '/landing' },
    { icon: User, label: 'Admin', path: '/admin' },
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
                const isActive = location.pathname === item.path;
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
                <Button variant="outline" size="icon" className="admin-profile-button border-white text-white hover:bg-white/20">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="admin-profile-dropdown">
                <DropdownMenuItem asChild>
                  <Link to="/admin/dashboard" className="admin-profile-item flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
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
                  className="admin-logout-item flex items-center gap-2 text-red-600 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="admin-mobile-menu md:hidden py-3 space-y-2">
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminTopNavigation;
