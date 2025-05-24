
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
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
  Minimize2,
  GripVertical,
  RotateCcw
} from 'lucide-react';
import { useDevelopmentMode, DevUserType } from '@/contexts/DevelopmentModeContext';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

const DEFAULT_POSITION: Position = { x: 20, y: 20 };
const STORAGE_KEY = 'dev-role-switcher-position';

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  // Check if we're in admin context
  const isAdminContext = window.location.pathname.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
    
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        // Validate position is within reasonable bounds
        if (parsedPosition.x >= 0 && parsedPosition.y >= 0 && 
            parsedPosition.x <= window.innerWidth - 200 && 
            parsedPosition.y <= window.innerHeight - 100) {
          setPosition(parsedPosition);
        }
      } catch (error) {
        console.log('DevRoleSwitcher: Failed to parse saved position, using default');
      }
    }
    
    // Enhanced logging for admin context
    console.log('DevRoleSwitcher mount state:', {
      isDevelopment,
      devMode,
      isDevModeActive,
      isAdminContext,
      pathname: window.location.pathname,
      mounted,
      position,
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

  // Handle drag events
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    
    // Save position to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosition));
    
    console.log('DevRoleSwitcher: Position saved:', newPosition);
  };

  // Reset position to default
  const resetPosition = () => {
    setPosition(DEFAULT_POSITION);
    localStorage.removeItem(STORAGE_KEY);
    console.log('DevRoleSwitcher: Position reset to default');
  };

  // Enhanced container classes with admin-specific styling and drag states
  const getContainerClasses = () => {
    const baseClasses = "min-w-[220px] select-none";
    const dragClasses = isDragging ? "shadow-2xl scale-105" : "shadow-lg";
    
    if (isAdminContext) {
      return cn(
        baseClasses,
        "bg-white/95 backdrop-blur-sm rounded-lg border-2 border-orange-200 p-4",
        "ring-2 ring-orange-100",
        dragClasses,
        "transition-all duration-200"
      );
    }
    
    return cn(
      baseClasses,
      "bg-white rounded-lg border-2 border-orange-200 p-4",
      dragClasses,
      "transition-all duration-200"
    );
  };

  const getCollapsedClasses = () => {
    const baseClasses = "select-none";
    const dragClasses = isDragging ? "shadow-2xl scale-105" : "shadow-lg";
    
    if (isAdminContext) {
      return cn(baseClasses, "ring-2 ring-orange-100", dragClasses, "transition-all duration-200");
    }
    
    return cn(baseClasses, dragClasses, "transition-all duration-200");
  };

  const DevContent = () => {
    if (isCollapsed) {
      return (
        <div className={getCollapsedClasses()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className={cn("border-2 cursor-pointer", currentColor)}
          >
            {React.createElement(currentIcon, { className: "h-4 w-4" })}
          </Button>
        </div>
      );
    }

    return (
      <div className={getContainerClasses()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical 
              className={cn(
                "h-4 w-4 text-orange-600 cursor-grab", 
                isDragging && "cursor-grabbing"
              )} 
            />
            <h3 className="text-sm font-semibold text-orange-800">
              🛠️ Dev Tools {isAdminContext && '(Admin)'}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetPosition}
              className="h-6 w-6 p-0 text-orange-600"
              title="Reset position"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
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
            <div className="mt-1 text-orange-600">Draggable • Position: {position.x}, {position.y}</div>
          </div>
        </div>
      </div>
    );
  };

  const DraggableDevContent = () => (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div 
        ref={nodeRef}
        className={cn("fixed", getZIndex())}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <div className="drag-handle">
          <DevContent />
        </div>
      </div>
    </Draggable>
  );

  // Use portal for admin context to ensure proper rendering above admin layout
  if (isAdminContext) {
    console.log('DevRoleSwitcher: Rendering with portal and drag for admin context');
    return createPortal(<DraggableDevContent />, document.body);
  }

  console.log('DevRoleSwitcher: Rendering with drag for non-admin context');
  return <DraggableDevContent />;
};

export default DevRoleSwitcher;
