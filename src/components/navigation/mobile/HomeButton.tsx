
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedNavItem from '../UnifiedNavItem';

interface HomeButtonProps {
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isPromoter?: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ 
  isActive, 
  onClick,
  isPromoter = false
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else {
      // Default navigation to landing when no onClick is provided
      navigate('/landing');
    }
  };

  return (
    <UnifiedNavItem
      path="/landing"
      icon={Home}
      label="Home"
      isActive={isActive}
      onClick={handleClick}
      variant="mobile"
      userType={isPromoter ? 'promoter' : 'individual'}
    />
  );
};

export default HomeButton;
