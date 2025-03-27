
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Plus, Search, User } from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TopNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Plus, label: 'Add', path: '/add' },
  ];

  return (
    <div className="hidden md:block w-full border-b border-material-outline">
      <div className="container max-w-5xl mx-auto py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
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
          <Link to="/admin">
            <Button variant="ghost" size="sm">Admin</Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="icon">
              <User size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
