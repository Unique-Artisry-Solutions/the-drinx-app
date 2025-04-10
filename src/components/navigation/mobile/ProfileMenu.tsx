
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Route, GlassWater, Store, BarChart4, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ProfileMenuProps {
  expanded: boolean;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ 
  expanded,
  userType = 'individual' 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const bgClass = isDark 
    ? 'bg-gray-900/95 border-t border-gray-800' 
    : userType === 'promoter'
      ? 'bg-white/95 border-t border-purple-200'
      : 'bg-white/95 border-t border-gray-100';
  
  const textClass = isDark 
    ? 'text-gray-300' 
    : userType === 'promoter'
      ? 'text-purple-700'
      : 'text-gray-600';
    
  const activeClass = isDark 
    ? 'bg-gray-800 text-white' 
    : userType === 'promoter'
      ? 'bg-purple-50 text-purple-700'
      : 'bg-spiritless-pink/10 text-spiritless-pink';
  
  const menuItems = userType === 'establishment' 
    ? [
        { icon: Store, label: 'Dashboard', path: '/establishment/dashboard' },
        { icon: BarChart4, label: 'Analytics', path: '/establishment/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' }
      ]
    : userType === 'promoter'
    ? [
        { icon: Megaphone, label: 'Promotions', path: '/promotions' },
        { icon: BarChart4, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' }
      ]
    : [
        { icon: Route, label: 'Swig Circuits', path: '/profile/bar-crawls' },
        { icon: GlassWater, label: 'Recipes', path: '/profile/recipes' },
        { icon: Settings, label: 'Settings', path: '/settings' }
      ];

  return (
    <div
      className={cn(
        'fixed bottom-16 left-0 right-0 border-b backdrop-blur-sm z-40 transition-all duration-300 transform',
        bgClass,
        expanded
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="p-2 flex flex-col">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-md mb-1',
              textClass,
              `hover:${activeClass}`
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu;
