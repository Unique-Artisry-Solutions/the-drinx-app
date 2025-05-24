
import React, { useEffect, useState } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Building, Megaphone, Shield, Settings, Move, RotateCcw } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { debugZIndexConflicts, debugDevSwitcherVisibility, debugAdminPageContext } from '@/utils/devDebugUtils';

interface DevRoleSwitcherProps {
  className?: string;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY = 'dev-role-switcher-position';
const DEFAULT_POSITION: Position = { x: 20, y: 20 };

const DevRoleSwitcher: React.FC<DevRoleSwitcherProps> = ({ className }) => {
  const { isDevelopment, devMode, isDevModeActive, switchToUserType } = useDevelopmentMode();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  
  const isAdminContext = location.pathname.startsWith('/admin');

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (error) {
        console.warn('Failed to parse saved position:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save position to localStorage
  const savePosition = (newPosition: Position) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosition));
  };

  // Reset position to default
  const resetPosition = () => {
    setPosition(DEFAULT_POSITION);
    savePosition(DEFAULT_POSITION);
  };

  // Handle drag events
  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    savePosition(newPosition);
  };

  // Debug logging
  useEffect(() => {
    console.log('DevRoleSwitcher mount state:', {
      isDevelopment,
      devMode,
      isDevModeActive,
      isAdminContext,
      pathname: location.pathname,
      mounted,
      position,
      timestamp: new Date().toISOString()
    });

    // Enhanced debug logging for admin context
    if (isAdminContext && mounted) {
      setTimeout(() => {
        debugAdminPageContext();
        debugDevSwitcherVisibility();
        debugZIndexConflicts();
      }, 500);
    }
  }, [isDevelopment, devMode, isDevModeActive, isAdminContext, location.pathname, mounted, position]);

  if (!isDevelopment || !mounted) {
    console.log('DevRoleSwitcher: Not rendering -', {
      isDevelopment,
      mounted,
      reason: !isDevelopment ? 'not development' : 'not mounted'
    });
    return null;
  }

  const handleRoleSwitch = (userType: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    console.log('DevRoleSwitcher - Switching to user type:', userType);
    switchToUserType(userType);
  };

  const roleOptions = [
    {
      type: 'individual' as const,
      label: 'Individual',
      icon: User,
      color: 'bg-spiritless-pink text-white',
      description: 'Regular user view'
    },
    {
      type: 'establishment' as const,
      label: 'Business',
      icon: Building,
      color: 'bg-blue-600 text-white',
      description: 'Business owner view'
    },
    {
      type: 'promoter' as const,
      label: 'Promoter',
      icon: Megaphone,
      color: 'bg-purple-600 text-white',
      description: 'Event promoter view'
    },
    {
      type: 'admin' as const,
      label: 'Admin',
      icon: Shield,
      color: 'bg-gray-800 text-white',
      description: 'Administrative view'
    }
  ];

  const getCurrentRole = () => {
    return roleOptions.find(role => role.type === devMode) || roleOptions[0];
  };

  const currentRole = getCurrentRole();
  
  // Get appropriate z-index for admin pages
  const getZIndex = () => {
    return isAdminContext ? 'z-[9999]' : 'z-[1000]';
  };

  // Component JSX
  const devSwitcherContent = (
    <Draggable
      position={position}
      onDrag={handleDrag}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div 
        className={cn(
          'fixed',
          getZIndex(),
          isDragging && 'shadow-2xl scale-105',
          'transition-all duration-200',
          className
        )}
        style={{
          filter: isDragging ? 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.25))' : 'none'
        }}
      >
        <Card className={cn(
          'border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg',
          isAdminContext && 'border-red-400 from-red-50 to-red-100',
          isDragging && 'rotate-1',
          'transition-all duration-200'
        )}>
          {/* Drag Handle Header */}
          <div className={cn(
            'drag-handle flex items-center justify-between p-3 border-b border-orange-200 bg-orange-100/50',
            isAdminContext && 'border-red-200 bg-red-100/50',
            'cursor-move hover:bg-orange-200/50 transition-colors',
            isAdminContext && 'hover:bg-red-200/50'
          )}>
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Dev Tools</span>
              {isAdminContext && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  ADMIN
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetPosition}
                className="h-6 w-6 p-0 hover:bg-orange-200"
                title="Reset position"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-6 w-6 p-0 hover:bg-orange-200"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!isCollapsed && (
            <div className="p-4">
              {/* Current Role Display */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <currentRole.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">Current Role:</span>
                </div>
                <Badge className={cn(currentRole.color, "text-xs")}>
                  {currentRole.label}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">{currentRole.description}</p>
              </div>

              <Separator className="my-3" />

              {/* Role Switch Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">Switch to:</div>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions
                    .filter(role => role.type !== devMode)
                    .map((role) => (
                    <Button
                      key={role.type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleSwitch(role.type)}
                      className="h-8 text-xs justify-start font-medium border-2 hover:scale-105 transition-transform"
                      title={`Switch to ${role.description}`}
                    >
                      <role.icon className="h-3 w-3 mr-1" />
                      {role.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Development Info */}
              <div className="mt-4 pt-3 border-t border-orange-200">
                <div className="text-xs text-orange-700 space-y-1">
                  <div>Mode: {isDevModeActive ? 'Active' : 'Inactive'}</div>
                  <div>Path: {location.pathname}</div>
                  {isAdminContext && (
                    <div className="text-red-700 font-medium">⚠️ Admin Context</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Draggable>
  );

  console.log('DevRoleSwitcher: Rendering with drag for', isAdminContext ? 'admin' : 'non-admin', 'context');

  // Always render using portal for proper z-index handling
  return createPortal(devSwitcherContent, document.body);
};

export default DevRoleSwitcher;
