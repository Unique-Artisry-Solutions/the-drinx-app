
import React from 'react';
import { ProfileHeaderProps } from '@/types/ProfileTypes';
import { Button } from '@/components/ui/button';
import { LogOut, Megaphone } from 'lucide-react';

interface ExtendedProfileHeaderProps extends ProfileHeaderProps {
  isPromoter?: boolean;
}

const ProfileHeader: React.FC<ExtendedProfileHeaderProps> = ({
  userName,
  handleLogout,
  isPromoter = false
}) => {
  const avatarGradient = isPromoter 
    ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
    : "bg-gradient-to-br from-spiritless-pink to-purple-400";
  
  const titleGradient = isPromoter
    ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
    : "bg-gradient-to-r from-spiritless-pink to-purple-600";

  return (
    <div className="flex items-center justify-between py-4 mb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`h-16 w-16 ${avatarGradient} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-white/70`}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className={`text-2xl font-bold text-material-on-background bg-clip-text text-transparent ${titleGradient}`}>
            Welcome, {userName}
          </h1>
          <p className="text-sm text-material-on-surface-variant flex items-center">
            {isPromoter && (
              <>
                <Megaphone className="h-3.5 w-3.5 mr-1 text-purple-500" />
                <span className="text-purple-600">Promoter account</span>
              </>
            )}
            {!isPromoter && "Explore your spiritless journey"}
          </p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={handleLogout}
        size="sm"
        className={`flex items-center gap-1 ${
          isPromoter 
            ? "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200" 
            : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        } transition-all`}
        title="Logout from all devices"
      >
        <LogOut size={14} />
        Logout
      </Button>
    </div>
  );
};

export default ProfileHeader;
