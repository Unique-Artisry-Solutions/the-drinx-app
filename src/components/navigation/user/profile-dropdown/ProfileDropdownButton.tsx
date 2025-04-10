
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profileDropdownStyles } from './profileDropdownStyles';

interface ProfileDropdownButtonProps {
  isDarkTheme: boolean;
  isPromoter?: boolean;
}

const ProfileDropdownButton: React.FC<ProfileDropdownButtonProps> = ({ 
  isDarkTheme,
  isPromoter = false
}) => {
  const baseClasses = profileDropdownStyles.dropdownButton(isDarkTheme);
  const promoterClasses = isPromoter ? 'border-purple-300 hover:border-purple-400' : '';

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={cn(baseClasses, promoterClasses)}
    >
      <ChevronDown className={`h-4 w-4 ${isPromoter ? 'text-purple-600' : ''}`} />
      <span className="sr-only">Toggle profile menu</span>
    </Button>
  );
};

export default ProfileDropdownButton;
