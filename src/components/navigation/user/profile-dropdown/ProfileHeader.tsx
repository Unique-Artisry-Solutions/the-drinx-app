
import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  username: string | null;
  isDarkTheme: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, isDarkTheme }) => {
  if (!username) return null;
  
  return (
    <div className={cn(
      "px-3 py-2 text-sm font-medium mb-1",
      isDarkTheme 
        ? "text-gray-300 border-b border-gray-700" 
        : "text-gray-700 border-b border-gray-200"
    )}>
      Signed in as <span className="text-spiritless-pink">{username}</span>
    </div>
  );
};

export default ProfileHeader;
