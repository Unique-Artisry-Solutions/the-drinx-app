
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ProfileDropdownButtonProps {
  isDarkTheme: boolean;
  isPromoter: boolean;
}

const ProfileDropdownButton: React.FC<ProfileDropdownButtonProps> = ({
  isDarkTheme,
  isPromoter
}) => {
  return (
    <ChevronDown 
      className={`h-3 w-3 ${
        isPromoter 
          ? 'text-purple-600' 
          : isDarkTheme 
            ? 'text-gray-300' 
            : 'text-gray-600'
      }`} 
    />
  );
};

export default ProfileDropdownButton;
