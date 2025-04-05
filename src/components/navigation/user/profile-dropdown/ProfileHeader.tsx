
import React from 'react';
import { profileDropdownStyles } from './profileDropdownStyles';

interface ProfileHeaderProps {
  username: string | null;
  isDarkTheme: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, isDarkTheme }) => {
  if (!username) return null;
  
  return (
    <div className={profileDropdownStyles.header(isDarkTheme)}>
      Signed in as <span className="text-spiritless-pink">{username}</span>
    </div>
  );
};

export default ProfileHeader;
