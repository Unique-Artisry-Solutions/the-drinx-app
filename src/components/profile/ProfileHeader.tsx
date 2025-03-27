
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  userName: string;
  handleLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName, handleLogout }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-medium text-material-on-background">My Profile</h1>
        <p className="text-material-on-surface-variant">
          Welcome back, {userName}
        </p>
      </div>
      <Button variant="outline" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default ProfileHeader;
