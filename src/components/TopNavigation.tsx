
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map } from 'lucide-react';
import CartButton from './cart/CartButton';
import { useAuth } from '@/contexts/auth/index';
import BackButton from './navigation/BackButton';
import UserProfileDropdown from './navigation/user/UserProfileDropdown';

interface TopNavigationProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = () => {
  const location = useLocation();
  const {
    signOut,
    user
  } = useAuth();

  // Get user type from local storage
  const userType = localStorage.getItem('user_type') === 'establishment' ? 'establishment' : 'individual';

  // Get username from local storage
  const username = localStorage.getItem('user_username') || user?.email || 'User';
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Determine if we should show the back button
  const shouldShowBackButton = () => {
    // Exclude certain paths
    const excludedPaths = ['/', '/landing', '/explore', '/map'];
    return !excludedPaths.includes(location.pathname) && !location.pathname.startsWith('/admin');
  };

  return <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between bg-zinc-900">
        <div className="flex items-center gap-2">
          {shouldShowBackButton() && <BackButton size="icon" showLabel={false} className="mr-2" />}
          <Link to="/" className="text-xl font-semibold text-material-primary">
            Spiritless
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Map Link for all devices */}
          <Link to="/map" className="text-gray-600 hover:text-gray-800">
            <Map size={20} />
          </Link>
          
          {/* Cart Button */}
          <CartButton />
          
          {/* Profile dropdown */}
          <UserProfileDropdown username={username} userType={userType as 'individual' | 'establishment'} handleLogout={handleLogout} />
        </div>
      </div>
    </header>;
};

export default TopNavigation;
