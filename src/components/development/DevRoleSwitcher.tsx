import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, User, Store, Megaphone, Shield, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface Position {
  x: number;
  y: number;
}

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isInitialized } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Show the component after a delay to ensure proper initialization
  useEffect(() => {
    if (isDevelopment && isInitialized) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isDevelopment, isInitialized]);

  // Load saved state from localStorage
  useEffect(() => {
    if (isDevelopment && isInitialized) {
      const savedCollapsed = localStorage.getItem('dev-switcher-collapsed');
      const savedPosition = localStorage.getItem('dev-switcher-position');
      
      if (savedCollapsed) {
        setIsCollapsed(JSON.parse(savedCollapsed));
      }
      
      if (savedPosition) {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
      }
    }
  }, [isDevelopment, isInitialized]);

  // Save state to localStorage
  useEffect(() => {
    if (isDevelopment && isVisible) {
      localStorage.setItem('dev-switcher-collapsed', JSON.stringify(isCollapsed));
      localStorage.setItem('dev-switcher-position', JSON.stringify(position));
    }
  }, [isCollapsed, position, isDevelopment, isVisible]);

  const handleDrag = (e: any, data: any) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Get the element dimensions
    const elementWidth = isCollapsed ? 60 : 280;
    const elementHeight = isCollapsed ? 60 : 200;
    
    // Calculate constrained position
    let newX = data.x;
    let newY = data.y;
    
    // Keep within viewport bounds
    newX = Math.max(0, Math.min(newX, viewport.width - elementWidth));
    newY = Math.max(0, Math.min(newY, viewport.height - elementHeight));
    
    // Snap to edges if close (within 20px)
    const snapDistance = 20;
    if (newX < snapDistance) newX = 10;
    if (newY < snapDistance) newY = 10;
    if (newX > viewport.width - elementWidth - snapDistance) newX = viewport.width - elementWidth - 10;
    if (newY > viewport.height - elementHeight - snapDistance) newY = viewport.height - elementHeight - 10;
    
    setPosition({ x: newX, y: newY });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const userTypes = [
    { type: 'individual' as const, label: 'Individual', icon: User, color: 'bg-blue-500' },
    { type: 'establishment' as const, label: 'Business', icon: Store, color: 'bg-green-500' },
    { type: 'promoter' as const, label: 'Promoter', icon: Megaphone, color: 'bg-purple-500' },
    { type: 'admin' as const, label: 'Admin', icon: Shield, color: 'bg-gray-700' }
  ];

  const currentUserType = userTypes.find(type => type.type === devMode);

  if (!isDevelopment || !isInitialized || !isVisible) return null;

  const isAdminMode = devMode === 'admin';

  const DevSwitcherContent = () => (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      handle=".drag-handle"
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`fixed z-[9999] transition-all duration-300 ${
          isCollapsed ? 'w-15 h-15' : 'w-70 min-h-50'
        }`}
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        <Card 
          className={`
            shadow-lg border-2 transition-all duration-300 hover:shadow-xl
            ${isAdminMode ? 'border-gray-600 bg-gray-50' : 'border-orange-400 bg-orange-50'}
            ${isCollapsed ? 'p-2' : 'p-4'}
          `}
        >
          {isCollapsed ? (
            // Collapsed state - just wrench icon
            <div 
              ref={dragRef}
              className="drag-handle cursor-move flex items-center justify-center hover:bg-black/5 rounded p-2 transition-colors"
              onClick={toggleCollapse}
            >
              <Wrench 
                className={`w-6 h-6 ${isAdminMode ? 'text-gray-700' : 'text-orange-700'}`}
              />
            </div>
          ) : (
            // Expanded state
            <div className="space-y-3">
              {/* Header with drag handle and controls */}
              <div className="flex items-center justify-between">
                <div 
                  ref={dragRef}
                  className="drag-handle cursor-move flex items-center gap-2 hover:bg-black/5 rounded p-1 transition-colors"
                >
                  <GripVertical className={`w-4 h-4 ${isAdminMode ? 'text-gray-600' : 'text-orange-600'}`} />
                  <Wrench className={`w-4 h-4 ${isAdminMode ? 'text-gray-700' : 'text-orange-700'}`} />
                  <span className={`text-sm font-semibold ${isAdminMode ? 'text-gray-800' : 'text-orange-800'}`}>
                    Dev Tools
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapse}
                  className="h-6 w-6 p-0 hover:bg-black/10"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Current mode display */}
              {currentUserType && (
                <div className="flex items-center gap-2">
                  <Badge className={`${currentUserType.color} text-white text-xs`}>
                    Current: {currentUserType.label}
                  </Badge>
                </div>
              )}

              {/* User type buttons */}
              <div className="grid grid-cols-2 gap-2">
                {userTypes.map((userType) => (
                  <Button
                    key={userType.type}
                    variant={devMode === userType.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchToUserType(userType.type)}
                    className={`
                      justify-start text-xs h-8 transition-all
                      ${devMode === userType.type 
                        ? `${userType.color} text-white hover:opacity-90` 
                        : `hover:${userType.color} hover:text-white border-gray-300`
                      }
                    `}
                  >
                    <userType.icon className="w-3 h-3 mr-1.5" />
                    {userType.label}
                  </Button>
                ))}
              </div>

              {/* Exit dev mode */}
              <Button
                variant="outline"
                size="sm"
                onClick={exitDevMode}
                className={`
                  w-full text-xs h-7 border-red-300 text-red-700 
                  hover:bg-red-50 hover:border-red-400
                `}
              >
                Exit Dev Mode
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Draggable>
  );

  return createPortal(<DevSwitcherContent />, document.body);
};

export default DevRoleSwitcher;
