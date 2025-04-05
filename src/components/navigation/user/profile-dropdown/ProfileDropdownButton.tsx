
import React, { forwardRef } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profileDropdownStyles } from './profileDropdownStyles';

interface ProfileDropdownButtonProps {
  isDarkTheme: boolean;
}

const ProfileDropdownButton = forwardRef<HTMLButtonElement, ProfileDropdownButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ isDarkTheme, ...props }, ref) => {
    return (
      <Button 
        ref={ref}
        variant="outline" 
        size="icon" 
        className={profileDropdownStyles.dropdownButton(isDarkTheme)}
        {...props}
      >
        <User size={18} className="transition-transform duration-300 hover:scale-110" />
      </Button>
    );
  }
);

ProfileDropdownButton.displayName = 'ProfileDropdownButton';

export default ProfileDropdownButton;
