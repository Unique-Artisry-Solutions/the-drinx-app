
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileDropdownButtonProps {
  isDarkTheme: boolean;
}

const ProfileDropdownButton: React.FC<ProfileDropdownButtonProps> = ({ isDarkTheme }) => {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={cn(
        "user-profile-button h-9 w-9 rounded-full transition-all duration-300 hover:text-spiritless-pink",
        isDarkTheme 
          ? "border-gray-700 bg-gray-800 hover:bg-gray-700" 
          : "border-gray-200 bg-white hover:bg-gray-50"
      )}
    >
      <User size={18} className="transition-transform duration-300 hover:scale-110" />
    </Button>
  );
};

export default ProfileDropdownButton;
