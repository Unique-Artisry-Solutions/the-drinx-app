
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Map, Route, Megaphone, BarChart2, Building, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnifiedNavItem from '../UnifiedNavItem';
import { isPathActive, getHomePathByUserType } from '@/utils/navigation';
import { useAppNavigation } from '@/hooks/useAppNavigation';

interface UserNavLinksProps {
  userType: 'individual' | 'establishment' | 'promoter';
}

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType }) => {
  const location = useLocation();
  const { goToHomePage } = useAppNavigation();
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goToHomePage(userType);
  };
  
  const getNavItems = () => {
    const homePath = getHomePathByUserType(userType);
    
    const navItems = [
      { icon: Home, label: 'Home', path: homePath },
      { icon: Map, label: 'Map', path: '/map' },
      { icon: Route, label: 'Circuits', path: '/swig-circuits' },
    ];
    
    if (userType === 'promoter') {
      navItems.push(
        { icon: Calendar, label: 'Events', path: '/promoter/events' },
        { icon: Building, label: 'Venues', path: '/explore' },
        { icon: Megaphone, label: 'Dashboard', path: '/promoter/dashboard' },
        { icon: BarChart2, label: 'Analytics', path: '/promoter/analytics' }
      );
    } else if (userType === 'establishment') {
      navItems.push({ icon: MessageSquare, label: 'Messages', path: '/establishment/communication' });
    }
    
    return navItems;
  };

  return (
    <div className="user-nav-links hidden md:flex space-x-1">
      {getNavItems().map((item) => {
        const isActive = isPathActive(location.pathname, item.path);
        
        return (
          <UnifiedNavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive}
            onClick={item.path.includes('Home') ? handleHomeClick : undefined}
            variant="default"
            userType={userType}
          />
        );
      })}
    </div>
  );
};

export default UserNavLinks;
