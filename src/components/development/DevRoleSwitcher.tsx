
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, User, Store, Megaphone, Shield, Minimize2, GripVertical } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

interface Position {
  x: number;
  y: number;
}

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isInitialized } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Show after initialization
  useEffect(() => {
    if (isDevelopment && isInitialized) {
      const savedCollapsed = localStorage.getItem('dev-switcher-collapsed');
      const savedPosition = localStorage.getItem('dev-switcher-position');
      
      if (savedCollapsed) setIsCollapsed(JSON.parse(savedCollapsed));
      if (savedPosition) setPosition(JSON.parse(savedPosition));
    }
  }, [isDevelopment, isInitialized]);

  // Save state changes
  useEffect(() => {
    if (isDevelopment && isInitialized) {
      localStorage.setItem('dev-switcher-collapsed', JSON.stringify(isCollapsed));
      localStorage.setItem('dev-switcher-position', JSON.stringify(position));
    }
  }, [isCollapsed, position, isDevelopment, isInitialized]);

  const handleDrag = (e: any, data: any) => {
    const elementWidth = isCollapsed ? 60 : 280;
    const elementHeight = isCollapsed ? 60 : 200;
    
    let newX = Math.max(0, Math.min(data.x, window.innerWidth - elementWidth));
    let newY = Math.max(0, Math.min(data.y, window.innerHeight - elementHeight));
    
    setPosition({ x: newX, y: newY });
  };

  if (!isDevelopment || !isInitialized) return null;

  const userTypes = [
    { type: 'individual' as const, label: 'Individual', icon: User, color: 'bg-blue-500' },
    { type: 'establishment' as const, label: 'Business', icon: Store, color: 'bg-green-500' },
    { type: 'promoter' as const, label: 'Promoter', icon: Megaphone, color: 'bg-purple-500' },
    { type: 'admin' as const, label: 'Admin', icon: Shield, color: 'bg-gray-700' }
  ];

  const currentUserType = userTypes.find(type => type.type === devMode);

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
        <Card className="shadow-lg border-2 border-orange-400 bg-orange-50 p-2">
          {isCollapsed ? (
            <div 
              className="drag-handle cursor-move flex items-center justify-center hover:bg-black/5 rounded p-2"
              onClick={() => setIsCollapsed(false)}
            >
              <Wrench className="w-6 h-6 text-orange-700" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="drag-handle cursor-move flex items-center gap-2 hover:bg-black/5 rounded p-1">
                  <GripVertical className="w-4 h-4 text-orange-600" />
                  <Wrench className="w-4 h-4 text-orange-700" />
                  <span className="text-sm font-semibold text-orange-800">Dev Tools</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="h-6 w-6 p-0"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </div>

              {currentUserType && (
                <Badge className={`${currentUserType.color} text-white text-xs`}>
                  Current: {currentUserType.label}
                </Badge>
              )}

              <div className="grid grid-cols-2 gap-2">
                {userTypes.map((userType) => (
                  <Button
                    key={userType.type}
                    variant={devMode === userType.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchToUserType(userType.type)}
                    className={`justify-start text-xs h-8 ${
                      devMode === userType.type 
                        ? `${userType.color} text-white` 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <userType.icon className="w-3 h-3 mr-1.5" />
                    {userType.label}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={exitDevMode}
                className="w-full text-xs h-7 border-red-300 text-red-700 hover:bg-red-50"
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
