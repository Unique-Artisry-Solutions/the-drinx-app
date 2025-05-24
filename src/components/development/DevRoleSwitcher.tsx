
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  X,
  Minimize2
} from 'lucide-react';
import { useDevelopmentMode, DevUserType } from '@/contexts/DevelopmentModeContext';
import { cn } from '@/lib/utils';

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if we're in admin context
  const isAdminContext = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    
    // Enhanced logging for admin context
    console.log('DevRoleSwitcher mount state:', {
      isDevelopment,
      devMode,
      isDevModeActive,
      isAdminContext,
      pathname: window.location.pathname,
      mounted,
      timestamp: new Date().toISOString()
    });

    // Check for z-index conflicts in admin
    if (isAdminContext) {
      console.log('DevRoleSwitcher: Admin context detected, checking for z-index conflicts');
      const adminElements = document.querySelectorAll('[class*="admin"], [class*="z-"]');
      console.log('DevRoleSwitcher: Found admin/z-index elements:', adminElements.length);
    }
  }, [isDevelopment, devMode, isDevModeActive, isAdminContext, mounted]);

  // Don't render if not in development or not mounted
  if (!isDevelopment || !mounted) {
    console.log('DevRoleSwitcher: Not rendering -', { 
      isDevelopment, 
      mounted,
      reason: !isDevelopment ? 'not in development' : 'not mounted'
    });
    return null;
  }

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
        return 'Guest';
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

  // Enhanced z-index for admin context
  const getZIndex = () => {
    if (isAdminContext) {
      return 'z-[9999]'; // Very high z-index for admin pages
    }
    return 'z-50';
  };

  // Enhanced container classes with admin-specific styling
  const getContainerClasses = () => {
    const baseClasses = "fixed top-4 right-4 min-w-[220px]";
    const zIndex = getZIndex();
    
    if (isAdminContext) {
      return cn(
        baseClasses,
        zIndex,
        "bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-orange-200 p-4",
        "ring-2 ring-orange-100"
      );
    }
    
    return cn(
      baseClasses,
      zIndex,
      "bg-white rounded-lg shadow-lg border-2 border-orange-200 p-4"
    );
  };

  const getCollapsedClasses = () => {
    const baseClasses = "fixed top-4 right-4";
    const zIndex = getZIndex();
    
    if (isAdminContext) {
      return cn(baseClasses, zIndex, "shadow-2xl ring-2 ring-orange-100");
    }
    
    return cn(baseClasses, zIndex, "shadow-lg");
  };

  const DevContent = () => {
    if (isCollapsed) {
      return (
        <div className={getCollapsedClasses()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className={cn("border-2", currentColor)}
          >
            {React.createElement(currentIcon, { className: "h-4 w-4" })}
          </Button>
        </div>
      );
    }

    return (
      <div className={getContainerClasses()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-orange-800">
            🛠️ Dev Tools {isAdminContext && '(Admin)'}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="h-6 w-6 p-0 text-orange-600"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-xs text-orange-600 font-medium">Current View:</div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("w-full justify-between border-2", currentColor)}
              >
                <div className="flex items-center gap-2">
                  {React.createElement(currentIcon, { className: "h-4 w-4" })}
                  <span className="font-medium">{currentLabel}</span>
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
            <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded border border-orange-300">
              🔧 Dev mode active - bypassing auth
              {isAdminContext && <div className="mt-1 font-medium">Admin context detected</div>}
            </div>
          )}
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 Use URL params: ?dev_mode=admin
            {isAdminContext && <div className="mt-1 text-orange-600">Z-index: {getZIndex()}</div>}
          </div>
        </div>
      </div>
    );
  };

  // Use portal for admin context to ensure proper rendering above admin layout
  if (isAdminContext) {
    console.log('DevRoleSwitcher: Rendering with portal for admin context');
    return createPortal(<DevContent />, document.body);
  }

  console.log('DevRoleSwitcher: Rendering normally for non-admin context');
  return <DevContent />;
};

export default DevRoleSwitcher;
