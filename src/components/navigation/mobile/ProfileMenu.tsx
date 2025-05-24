
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Heart, CreditCard, HelpCircle, LogOut, Building, Megaphone, BarChart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ProfileMenuProps {
  expanded: boolean;
  userType: 'individual' | 'establishment' | 'promoter';
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ expanded, userType }) => {
  const { theme } = useTheme();

  const getProfileItems = () => {
    const baseItems = [
      { icon: User, label: 'View Profile', path: getProfilePath() },
      { icon: Settings, label: 'Settings', path: `${getProfilePath()}/settings` },
      { icon: HelpCircle, label: 'Help & Support', path: '/help' }
    ];

    switch (userType) {
      case 'establishment':
        return [
          { icon: Building, label: 'Business Dashboard', path: '/establishment/dashboard' },
          { icon: BarChart, label: 'Analytics', path: '/establishment/analytics' },
          ...baseItems,
          { icon: CreditCard, label: 'Billing', path: '/establishment/billing' }
        ];
      case 'promoter':
        return [
          { icon: Megaphone, label: 'Promoter Dashboard', path: '/promoter/dashboard' },
          { icon: BarChart, label: 'Analytics', path: '/promoter/analytics' },
          ...baseItems,
          { icon: CreditCard, label: 'Billing', path: '/promoter/billing' }
        ];
      case 'individual':
      default:
        return [
          ...baseItems,
          { icon: Heart, label: 'Favorites', path: '/profile/favorites' },
          { icon: CreditCard, label: 'Payment Methods', path: '/profile/payment' }
        ];
    }
  };

  const getProfilePath = () => {
    switch (userType) {
      case 'establishment':
        return '/establishment/profile';
      case 'promoter':
        return '/promoter/profile';
      case 'individual':
      default:
        return '/profile';
    }
  };

  const profileItems = getProfileItems();

  const menuClasses = cn(
    "fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40",
    expanded ? "translate-y-0" : "translate-y-full",
    userType === 'promoter' && "border-purple-200"
  );

  const getUserTypeColor = () => {
    switch (userType) {
      case 'establishment':
        return 'text-blue-600';
      case 'promoter':
        return 'text-purple-600';
      case 'individual':
      default:
        return 'text-spiritless-pink';
    }
  };

  if (!expanded) return null;

  return (
    <div className={menuClasses}>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className={cn("font-medium", getUserTypeColor())}>
          {userType === 'establishment' ? 'Business Menu' : 
           userType === 'promoter' ? 'Promoter Menu' : 'Profile Menu'}
        </h3>
      </div>
      <div className="py-2">
        {profileItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <item.icon className={cn("h-4 w-4 mr-3", getUserTypeColor())} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu;
