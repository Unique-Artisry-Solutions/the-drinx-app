
import React from 'react';
import { ProfileHeaderProps } from '@/types/ProfileTypes';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  handleLogout
}) => {
  return (
    <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-gradient-to-br from-spiritless-pink to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-medium text-material-on-background">
            Welcome, {userName}
          </h1>
          <p className="text-material-on-surface-variant">
            Explore your spiritless journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
