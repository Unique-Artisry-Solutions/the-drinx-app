
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  MapPin, 
  Plus, 
  Search,
  Settings, 
  LogOut, 
  User,
  Layout,
  Globe,
  Store,
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface AdminNavigationProps {
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onLogout }) => {
  return (
    <NavigationMenu className="max-w-none">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            Main App
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
              <ListItem href="/" title="Home" icon={<Home className="h-4 w-4" />}>
                Return to the main application
              </ListItem>
              <ListItem href="/explore" title="Explore" icon={<Search className="h-4 w-4" />}>
                Discover mocktails and establishments
              </ListItem>
              <ListItem href="/map" title="Map" icon={<MapPin className="h-4 w-4" />}>
                Find nearby establishments
              </ListItem>
              <ListItem href="/add" title="Add" icon={<Plus className="h-4 w-4" />}>
                Add new mocktails or establishments
              </ListItem>
              <ListItem href="/landing" title="Landing Page" icon={<Globe className="h-4 w-4" />}>
                View the landing page
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            Admin
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
              <ListItem href="/admin/dashboard" title="Dashboard" icon={<Layout className="h-4 w-4" />}>
                Admin dashboard overview
              </ListItem>
              <ListItem href="/admin/users" title="Users" icon={<Users className="h-4 w-4" />}>
                Manage user accounts
              </ListItem>
              <ListItem href="/admin/establishments" title="Establishments" icon={<Store className="h-4 w-4" />}>
                Manage registered establishments
              </ListItem>
              <ListItem href="/profile" title="User Profile" icon={<User className="h-4 w-4" />}>
                View user profile page
              </ListItem>
              <ListItem href="/establishment/profile" title="Establishment Profile" icon={<Store className="h-4 w-4" />}>
                View establishment profile page
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 hover:text-white">
            Auth
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 p-4">
              <ListItem href="/login" title="Login Page" icon={<User className="h-4 w-4" />}>
                View the login page
              </ListItem>
              <ListItem href="/signup" title="Signup Page" icon={<Users className="h-4 w-4" />}>
                View the signup page
              </ListItem>
              <li className="px-2 py-2">
                <button 
                  onClick={onLogout} 
                  className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {icon}
            <span>{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default AdminNavigation;
