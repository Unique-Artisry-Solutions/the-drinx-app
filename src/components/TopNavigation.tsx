
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Map } from 'lucide-react';
import CartButton from './cart/CartButton';
import { useAuth } from '@/contexts/auth';

interface TopNavigationProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { signOut } = useAuth();
  
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Close the profile dropdown
      setIsProfileOpen(false);
      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-material-primary">
          Spiritless
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Map Link for mobile */}
          <Link to="/map" className="md:hidden text-gray-600 hover:text-gray-800">
            <Map size={20} />
          </Link>
          
          {/* Cart Button */}
          <CartButton />
          
          {/* Profile dropdown - Hidden on smaller screens, always visible on larger */}
          <div className="relative md:block">
            <button onClick={toggleProfile} className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-800 focus:outline-none">
              <Settings size={20} />
              Profile
            </button>
            
            {/* Profile dropdown content */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
