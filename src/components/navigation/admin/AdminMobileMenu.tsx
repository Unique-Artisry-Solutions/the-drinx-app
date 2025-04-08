
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown/dropdown-items';
import { adminNavItems } from './AdminNavItems';
import { LogOut } from 'lucide-react';

interface AdminMobileMenuProps {
  onLogout?: () => void;
}

export const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ onLogout }) => {
  return (
    <div className="py-2">
      {adminNavItems.map((item) => (
        <DropdownMenuItem key={item.href} asChild>
          <NavLink 
            to={item.href} 
            className={({ isActive }) => `flex items-center px-2 py-2 text-sm rounded-md ${
              isActive ? 'bg-accent' : ''
            }`}
          >
            <item.icon className="h-4 w-4 mr-2" />
            <span>{item.label}</span>
          </NavLink>
        </DropdownMenuItem>
      ))}
      
      {onLogout && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </>
      )}
    </div>
  );
};
