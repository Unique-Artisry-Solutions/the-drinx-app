
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
  Globe
} from 'lucide-react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar";

interface AdminNavigationProps {
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onLogout }) => {
  return (
    <Menubar className="border-none bg-transparent px-0">
      {/* Main App Navigation */}
      <MenubarMenu>
        <MenubarTrigger className="font-medium text-white">Main App</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/explore" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Map</span>
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem asChild>
            <Link to="/landing" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Landing Page</span>
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Admin Pages */}
      <MenubarMenu>
        <MenubarTrigger className="font-medium text-white">Admin</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Auth Pages */}
      <MenubarMenu>
        <MenubarTrigger className="font-medium text-white">Auth</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild>
            <Link to="/login" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Login Page</span>
            </Link>
          </MenubarItem>
          <MenubarItem asChild>
            <Link to="/signup" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Signup Page</span>
            </Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="flex items-center gap-2 text-red-600" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default AdminNavigation;
