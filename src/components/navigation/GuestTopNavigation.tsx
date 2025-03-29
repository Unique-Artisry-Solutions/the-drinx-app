
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CartButton from '@/components/cart/CartButton';

const GuestTopNavigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const guestNavItems = [
    { icon: Home, label: 'Home', path: '/landing' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  ];

  return (
    <nav className="guest-top-nav fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="guest-nav-container max-w-6xl mx-auto px-4 py-3">
        <div className="guest-nav-inner flex items-center justify-between">
          <div className="guest-nav-left flex items-center">
            <Link to="/landing" className="guest-nav-logo text-xl font-semibold text-material-primary mr-6">
              Spirit<span>less</span>
            </Link>
            
            <div className="guest-nav-links hidden md:flex space-x-1">
              {guestNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`guest-nav-link px-3 py-2 rounded-md flex items-center ${
                      isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="guest-nav-right flex items-center space-x-2">
            <CartButton />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="guest-menu-button md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            
            <div className="guest-auth-buttons hidden md:flex space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="guest-login-button flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm" className="guest-signup-button flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="guest-mobile-menu md:hidden py-3 space-y-2">
            {guestNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`guest-mobile-link block px-3 py-2 rounded-md ${
                    isActive ? 'bg-material-primary/10 text-material-primary' : 'text-gray-600 hover:bg-gray-100'
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
            <div className="guest-mobile-auth flex space-x-2 px-3 py-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="guest-mobile-login w-full flex items-center justify-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button variant="default" className="guest-mobile-signup w-full flex items-center justify-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GuestTopNavigation;
