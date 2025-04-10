
import React from 'react';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  username: string | null;
  isDarkTheme: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  isDarkTheme
}) => {
  return (
    <div className={`px-2 py-2 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <User className={`h-4 w-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
        </div>
        <div>
          <p className={`text-sm font-medium truncate max-w-[160px] ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            {username || 'Guest User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {username ? 'Signed In' : 'Not Signed In'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
