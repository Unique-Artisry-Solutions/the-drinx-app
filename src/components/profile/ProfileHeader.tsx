
import React from 'react';
import { ProfileHeaderProps } from '@/types/ProfileTypes';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  handleLogout
}) => {
  return (
    <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 bg-gradient-to-br from-spiritless-pink to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-white/70">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-material-on-background bg-clip-text text-transparent bg-gradient-to-r from-spiritless-pink to-purple-600">
            Welcome, {userName}
          </h1>
          <p className="text-sm text-material-on-surface-variant">
            Explore your spiritless journey
          </p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={handleLogout}
        size="sm"
        className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
      >
        <LogOut size={14} />
        Logout
      </Button>
    </div>
  );
};

export default ProfileHeader;
