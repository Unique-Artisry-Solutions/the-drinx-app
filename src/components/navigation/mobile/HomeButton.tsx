
import React from 'react';
import { Home, Building, Megaphone } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface HomeButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  userType?: 'individual' | 'establishment' | 'promoter';
}

const HomeButton: React.FC<HomeButtonProps> = ({ 
  isActive, 
  onClick, 
  userType = 'individual' 
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (userType) {
      case 'establishment':
        return Building;
      case 'promoter':
        return Megaphone;
      case 'individual':
      default:
        return Home;
    }
  };

  const getLabel = () => {
    switch (userType) {
      case 'establishment':
        return 'Dashboard';
      case 'promoter':
        return 'Dashboard';
      case 'individual':
      default:
        return 'Home';
    }
  };

  const getActiveColor = () => {
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

  const IconComponent = getIcon();
  const label = getLabel();
  const activeColor = getActiveColor();

  const buttonClasses = cn(
    "flex flex-col items-center justify-center px-3 py-2 text-xs transition-colors",
    isActive 
      ? activeColor
      : theme === 'dark' 
        ? "text-gray-400 hover:text-white" 
        : "text-gray-500 hover:text-gray-700"
  );

  return (
    <button onClick={onClick} className={buttonClasses}>
      <IconComponent className="h-5 w-5 mb-1" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default HomeButton;
