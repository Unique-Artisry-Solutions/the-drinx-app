
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Image } from 'lucide-react';

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
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-spiritless-burgundy/25">
              Dashboard
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/admin/establishments">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-spiritless-burgundy/25">
              Establishments
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-spiritless-burgundy/25">
              Users
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/admin/system-breakdown">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-spiritless-burgundy/25">
              System Breakdown
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/admin/photo-moderation">
            <Button variant="ghost" className="flex items-center gap-1 text-white hover:text-white hover:bg-spiritless-burgundy/25">
              <Image size={16} />
              Photo Moderation
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavigation;
