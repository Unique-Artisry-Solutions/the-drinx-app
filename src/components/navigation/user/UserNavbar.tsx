import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { toUserType } from '@/utils/userTypeGuards';
import { cn } from '@/lib/utils';

interface UserNavbarProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: { value: string; label: string }[];
}

const UserNavbar: React.FC<UserNavbarProps> = ({ 
  activeTab,
  handleTabChange,
  tabOptions = []
}) => {
  const { userType: rawUserType } = useAuth();
  const { isDevelopment, isDevModeActive } = useDevelopmentMode();
  
  // Safely convert userType to UserType
  const userType = toUserType(rawUserType);
  
  const location = useLocation();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was a problem logging out',
        variant: 'destructive',
      });
    }
  };

  const avatarName = user?.user_metadata?.name || 'Spiritless User';
  const avatarURL = user?.user_metadata?.avatar_url;

  const isTabActive = (tabValue: string) => {
    return activeTab === tabValue ? 'bg-accent text-accent-foreground' : '';
  };

  const getTabColor = (tabValue: string) => {
    const convertedUserType = toUserType(tabValue);
    switch (convertedUserType) {
      case 'establishment':
        return 'text-spiritless-green';
      case 'promoter':
        return 'text-purple-600';
      default:
        return 'text-spiritless-pink';
    }
  };

  const getActiveColor = (tabValue: string) => {
    const convertedUserType = toUserType(tabValue);
    switch (convertedUserType) {
      case 'establishment':
        return 'border-spiritless-green text-spiritless-green bg-spiritless-green/10';
      case 'promoter':
        return 'border-purple-600 text-purple-600 bg-purple-100';
      default:
        return 'border-spiritless-pink text-spiritless-pink bg-spiritless-pink/10';
    }
  };

  const getNavItemColor = (item: any) => {
    const convertedUserType = toUserType(userType);
    switch (convertedUserType) {
      case 'establishment':
        return location.pathname === item.href ? 'text-spiritless-green' : 'hover:text-spiritless-green';
      case 'promoter':
        return location.pathname === item.href ? 'text-purple-600' : 'hover:text-purple-600';
      default:
        return location.pathname === item.href ? 'text-spiritless-pink' : 'hover:text-spiritless-pink';
    }
  };

  return (
    <nav className="bg-white border-b">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold">
            Spirit<span className="text-spiritless-pink">less</span>
          </Link>
          
          {tabOptions.length > 0 && (
            <div className="hidden md:flex items-center ml-6 space-x-4">
              {tabOptions.map((tab) => (
                <Button
                  key={tab.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTabChange && handleTabChange(tab.value)}
                  className={`rounded-full text-sm font-medium ${isTabActive(tab.value)} ${getActiveColor(tab.value)} hover:bg-accent hover:text-accent-foreground`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                {avatarURL ? (
                  <AvatarImage src={avatarURL} alt={avatarName} />
                ) : (
                  <AvatarFallback>{avatarName?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default UserNavbar;
