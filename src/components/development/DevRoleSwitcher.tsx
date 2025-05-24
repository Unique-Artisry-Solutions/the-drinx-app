
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  UserCog, 
  Store, 
  Megaphone, 
  Shield, 
  User, 
  ChevronDown,
  X 
} from 'lucide-react';
import { useDevelopmentMode, DevUserType } from '@/hooks/useDevelopmentMode';
import { cn } from '@/lib/utils';

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isDevelopment) return null;

  const getUserTypeIcon = (userType: DevUserType) => {
    switch (userType) {
      case 'establishment':
        return Store;
      case 'promoter':
        return Megaphone;
      case 'admin':
        return Shield;
      case 'individual':
        return User;
      default:
        return UserCog;
    }
  };

  const getUserTypeLabel = (userType: DevUserType) => {
    switch (userType) {
      case 'establishment':
        return 'Business';
      case 'promoter':
        return 'Promoter';
      case 'admin':
        return 'Admin';
      case 'individual':
        return 'Individual';
      default:
        return 'None';
    }
  };

  const getUserTypeColor = (userType: DevUserType) => {
    switch (userType) {
      case 'establishment':
        return 'text-spiritless-green border-spiritless-green bg-spiritless-green/10';
      case 'promoter':
        return 'text-purple-600 border-purple-600 bg-purple-100';
      case 'admin':
        return 'text-gray-800 border-gray-800 bg-gray-100';
      case 'individual':
        return 'text-spiritless-pink border-spiritless-pink bg-spiritless-pink/10';
      default:
        return 'text-gray-500 border-gray-300 bg-gray-50';
    }
  };

  const currentIcon = getUserTypeIcon(devMode);
  const currentLabel = getUserTypeLabel(devMode);
  const currentColor = getUserTypeColor(devMode);

  if (isCollapsed) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className={cn("shadow-lg", currentColor)}
        >
          {React.createElement(currentIcon, { className: "h-4 w-4" })}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Dev Tools</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(true)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-2">Current View:</div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("w-full justify-between", currentColor)}
            >
              <div className="flex items-center gap-2">
                {React.createElement(currentIcon, { className: "h-4 w-4" })}
                <span>{currentLabel}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => switchToUserType('individual')}>
              <User className="h-4 w-4 mr-2" />
              Individual View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchToUserType('establishment')}>
              <Store className="h-4 w-4 mr-2" />
              Business View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchToUserType('promoter')}>
              <Megaphone className="h-4 w-4 mr-2" />
              Promoter View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchToUserType('admin')}>
              <Shield className="h-4 w-4 mr-2" />
              Admin View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exitDevMode}>
              <X className="h-4 w-4 mr-2" />
              Exit Dev Mode
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isDevModeActive && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border">
            ⚠️ Development mode active
          </div>
        )}
      </div>
    </div>
  );
};

export default DevRoleSwitcher;
