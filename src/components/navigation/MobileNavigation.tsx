
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { NavigationType, UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import { getNavItems } from './utils/navigationItems';

interface MobileNavigationProps {
  type: NavigationType;
  userType: 'individual' | 'establishment' | 'promoter';
  forceGuestNavigation?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  type, 
  userType,
  forceGuestNavigation = false
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [navItems, setNavItems] = React.useState<UnifiedNavItem[]>([]);
  
  const getProfilePath = () => {
    switch (userType) {
      case 'establishment':
        return '/establishment/profile';
      case 'promoter':
        return '/promoter/profile';
      default:
        return '/profile';
    }
  };
  
  useEffect(() => {
    // Get navigation items based on type and user type
    const items = getNavItems(
      type, 
      userType, 
      forceGuestNavigation,
      user,
      location,
      getProfilePath
    );
    setNavItems(items);
  }, [type, userType, location, user, forceGuestNavigation]);
  
  // Debug navigation items
  useEffect(() => {
    console.log('MobileNavigation items:', { 
      type, 
      userType, 
      forceGuestNavigation,
      itemCount: navItems.length,
      itemLabels: navItems.map(i => i.label)
    });
  }, [type, userType, navItems, forceGuestNavigation]);

  // If no navigation items, don't render
  if (!navItems || navItems.length === 0) {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item, index) => {
          if (!item.icon) return null;
          
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <a 
              key={`mobile-nav-${index}`}
              href={item.path}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick(e);
                }
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
