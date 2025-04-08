
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Image, Palette, Settings, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

interface AdminNavigationProps {
  onLogout: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({
  onLogout
}) => {
  return (
    <nav className="flex-1">
      <ul className="flex space-x-6">
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-white hover:bg-spiritless-burgundy/25">
                <Settings size={16} />
                Settings
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover z-50">
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/establishments" className="flex items-center gap-2">
                  <span>Establishments</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/users" className="flex items-center gap-2">
                  <span>Users</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/system-breakdown" className="flex items-center gap-2">
                  <span>System Breakdown</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/photo-moderation" className="flex items-center gap-2">
                  <Image size={16} className="mr-1" />
                  <span>Photo Moderation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/theme-customization" className="flex items-center gap-2">
                  <Palette size={16} className="mr-1" />
                  <span>Theme Customization</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
