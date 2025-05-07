
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';
import UnifiedNavItemComponent from '../UnifiedNavItem';

interface NavItemProps {
  item: UnifiedNavItem;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isPromoter?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  isActive, 
  onClick,
  isPromoter = false
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    } else {
      e.preventDefault();
      navigate(item.path);
    }
  };

  return (
    <UnifiedNavItemComponent
      path={item.path}
      icon={item.icon}
      label={item.label}
      isActive={isActive}
      onClick={handleClick}
      variant="mobile"
      userType={isPromoter ? 'promoter' : 'individual'}
      dropdown={item.dropdown}
    />
  );
};

export default NavItem;
