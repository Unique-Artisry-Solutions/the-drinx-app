import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, ShoppingCart, User, Settings, LogOut, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { useToast } from '@/hooks/use-toast';
import CartButton from '@/components/cart/CartButton';
import { useCart } from '@/contexts/CartContext';

// Types of navigation
export enum NavigationType {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
}

interface NavigationTypesProps {
  type: NavigationType;
  userType?: 'individual' | 'establishment';
}

const NavigationTypes: React.FC<NavigationTypesProps> = ({ type, userType = 'individual' }) => {
  const location = useLocation();
  const { toast } = useToast();
  const { items } = useCart();
  
  const handleLogout = () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_type');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    
    window.location.href = '/';
  };

  // Guest Navigation Items
  const guestNavItems = [
    { icon: Home, label: 'Home', path: '/landing' },
    { icon: ShoppingCart, label: 'Cart', path: '/checkout' },
  ];

  // User Navigation Items
  const userNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
  ];

  // Admin Navigation Items
  const adminNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
    { icon: Globe, label: 'Landing', path: '/landing' },
  ];

  const getNavItems = () => {
    switch (type) {
      case NavigationType.GUEST:
        return guestNavItems;
      case NavigationType.USER:
        return userNavItems;
      case NavigationType.ADMIN:
        return adminNavItems;
      default:
        return guestNavItems;
    }
  };

  const navItems = getNavItems();

  const getProfileLink = () => {
    if (userType === 'establishment') {
      return '/establishment/profile';
    }
    return '/profile';
  };

  // Determine if current page is an interior app page
  const isInteriorPage = () => {
    const interiorPaths = ['/map', '/add', '/establishment/', '/cocktail/', '/profile'];
    return interiorPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <div className="hidden md:block w-full border-b border-material-outline">
      <div className="container max-w-5xl mx-auto py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to={type === NavigationType.GUEST ? "/landing" : "/"} className="mr-6">
            <h1 className="text-2xl font-medium text-material-on-background">
              Spirit<span className="text-material-primary">less</span>
            </h1>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path}>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          isActive && "bg-material-primary/10 text-material-primary"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center space-x-4">
          {type === NavigationType.GUEST && !isInteriorPage() && <CartButton />}
          
          {type === NavigationType.ADMIN && (
            <Link to="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          )}
          
          {type === NavigationType.GUEST ? (
            <>
              <Link to="/login">
                <Button variant="default">Login</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={getProfileLink()} className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationTypes;
