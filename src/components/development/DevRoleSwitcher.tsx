
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building, 
  Megaphone, 
  Shield, 
  Settings, 
  X, 
  Minimize2, 
  Maximize2,
  Move,
  RotateCcw
} from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useLocation } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

interface ViewportBounds {
  width: number;
  height: number;
}

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const location = useLocation();
  
  // Component state
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [minimalMode, setMinimalMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds>({ width: window.innerWidth, height: window.innerHeight });
  
  // Refs
  const componentRef = useRef<HTMLDivElement>(null);
  const portalRoot = useRef<HTMLDivElement | null>(null);
  
  // Context checks
  const isAdminContext = location.pathname.startsWith('/admin');
  
  // Constants for smart positioning
  const SNAP_THRESHOLD = 30;
  const EDGE_PADDING = 10;
  const COMPONENT_WIDTH = collapsed ? (isAdminContext ? 60 : 80) : (isAdminContext ? 280 : 320);
  const COMPONENT_HEIGHT = collapsed ? (isAdminContext ? 40 : 50) : (isAdminContext ? 200 : 280);

  // Initialize portal and mount state
  useEffect(() => {
    // Create portal container
    const portalContainer = document.createElement('div');
    portalContainer.id = 'dev-role-switcher-portal';
    portalContainer.style.position = 'fixed';
    portalContainer.style.top = '0';
    portalContainer.style.left = '0';
    portalContainer.style.zIndex = '99999';
    portalContainer.style.pointerEvents = 'none';
    document.body.appendChild(portalContainer);
    portalRoot.current = portalContainer;
    
    setMounted(true);
    
    // Load saved state
    const savedPosition = localStorage.getItem('dev_switcher_position');
    const savedCollapsed = localStorage.getItem('dev_switcher_collapsed');
    const savedMinimal = localStorage.getItem('dev_switcher_minimal');
    
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(validatePosition(parsed));
      } catch (e) {
        console.warn('Failed to parse saved position:', e);
      }
    }
    
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === 'true');
    }
    
    if (savedMinimal) {
      setMinimalMode(savedMinimal === 'true');
    }
    
    // Auto-enable minimal mode for admin pages initially
    if (isAdminContext && !savedMinimal) {
      setMinimalMode(true);
    }

    return () => {
      if (portalRoot.current && document.body.contains(portalRoot.current)) {
        document.body.removeChild(portalRoot.current);
      }
    };
  }, []);

  // Update viewport bounds on resize
  useEffect(() => {
    const handleResize = () => {
      const newBounds = { width: window.innerWidth, height: window.innerHeight };
      setViewportBounds(newBounds);
      setPosition(prev => validatePosition(prev, newBounds));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validate and constrain position to viewport
  const validatePosition = useCallback((pos: Position, bounds = viewportBounds): Position => {
    const maxX = bounds.width - COMPONENT_WIDTH - EDGE_PADDING;
    const maxY = bounds.height - COMPONENT_HEIGHT - EDGE_PADDING;
    
    return {
      x: Math.max(EDGE_PADDING, Math.min(maxX, pos.x)),
      y: Math.max(EDGE_PADDING, Math.min(maxY, pos.y))
    };
  }, [viewportBounds, COMPONENT_WIDTH, COMPONENT_HEIGHT]);

  // Smart edge snapping
  const snapToEdge = useCallback((pos: Position): Position => {
    const { width, height } = viewportBounds;
    let newPos = { ...pos };
    
    // Snap to left edge
    if (pos.x < SNAP_THRESHOLD) {
      newPos.x = EDGE_PADDING;
    }
    // Snap to right edge
    else if (pos.x > width - COMPONENT_WIDTH - SNAP_THRESHOLD) {
      newPos.x = width - COMPONENT_WIDTH - EDGE_PADDING;
    }
    
    // Snap to top edge
    if (pos.y < SNAP_THRESHOLD) {
      newPos.y = EDGE_PADDING;
    }
    // Snap to bottom edge
    else if (pos.y > height - COMPONENT_HEIGHT - SNAP_THRESHOLD) {
      newPos.y = height - COMPONENT_HEIGHT - EDGE_PADDING;
    }
    
    return newPos;
  }, [viewportBounds, COMPONENT_WIDTH, COMPONENT_HEIGHT]);

  // Handle drag events
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback((_e: DraggableEvent, data: DraggableData) => {
    const newPosition = snapToEdge({ x: data.x, y: data.y });
    const validatedPosition = validatePosition(newPosition);
    
    setPosition(validatedPosition);
    setIsDragging(false);
    
    // Save position
    localStorage.setItem('dev_switcher_position', JSON.stringify(validatedPosition));
  }, [snapToEdge, validatePosition]);

  // Handle state changes
  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('dev_switcher_collapsed', newCollapsed.toString());
  }, [collapsed]);

  const handleToggleMinimal = useCallback(() => {
    const newMinimal = !minimalMode;
    setMinimalMode(newMinimal);
    localStorage.setItem('dev_switcher_minimal', newMinimal.toString());
  }, [minimalMode]);

  const handleResetPosition = useCallback(() => {
    const defaultPosition = { x: 20, y: 20 };
    setPosition(defaultPosition);
    localStorage.setItem('dev_switcher_position', JSON.stringify(defaultPosition));
  }, []);

  // User type options with admin theming
  const userTypeOptions = [
    {
      type: 'individual' as const,
      label: 'Individual',
      icon: User,
      color: isAdminContext ? 'text-blue-600 hover:bg-blue-50' : 'text-spiritless-pink hover:bg-spiritless-pink/10'
    },
    {
      type: 'establishment' as const,
      label: 'Business',
      icon: Building,
      color: isAdminContext ? 'text-green-600 hover:bg-green-50' : 'text-spiritless-green hover:bg-spiritless-green/10'
    },
    {
      type: 'promoter' as const,
      label: 'Promoter',
      icon: Megaphone,
      color: isAdminContext ? 'text-purple-600 hover:bg-purple-50' : 'text-purple-600 hover:bg-purple-100'
    },
    {
      type: 'admin' as const,
      label: 'Admin',
      icon: Shield,
      color: isAdminContext ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-800 hover:bg-gray-100'
    }
  ];

  // Don't render if not in development mode
  if (!isDevelopment || !mounted || !portalRoot.current) {
    return null;
  }

  // Get theme classes based on context
  const getThemeClasses = () => {
    if (isAdminContext) {
      return {
        card: 'bg-gray-50 border-gray-300 shadow-lg',
        header: 'bg-gray-100 border-gray-300',
        badge: 'bg-gray-600 text-white',
        text: 'text-gray-700'
      };
    }
    return {
      card: 'bg-orange-50 border-orange-300 shadow-lg',
      header: 'bg-orange-100 border-orange-300',
      badge: 'bg-orange-600 text-white',
      text: 'text-orange-700'
    };
  };

  const theme = getThemeClasses();

  const renderComponent = () => (
    <Draggable
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      handle=".drag-handle"
      bounds="parent"
    >
      <div
        ref={componentRef}
        className={`
          fixed transition-all duration-300 ease-in-out
          ${isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-auto'}
          ${isHovered && !isDragging ? 'scale-102 shadow-xl' : ''}
          ${minimalMode ? 'opacity-60 hover:opacity-100' : ''}
        `}
        style={{ 
          pointerEvents: 'auto',
          width: COMPONENT_WIDTH,
          minHeight: collapsed ? (isAdminContext ? 40 : 50) : 'auto'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={`${theme.card} transition-all duration-300 ${collapsed ? 'h-auto' : ''}`}>
          <CardHeader 
            className={`
              drag-handle cursor-move p-2 ${theme.header}
              flex flex-row items-center justify-between space-y-0
              hover:bg-opacity-80 transition-colors duration-200
            `}
          >
            <div className="flex items-center space-x-2">
              <Move className="h-3 w-3 text-gray-500" />
              <CardTitle className={`text-xs font-medium ${theme.text}`}>
                {isAdminContext ? 'Dev Tools' : 'Development Mode'}
              </CardTitle>
              {devMode && (
                <Badge variant="secondary" className={`text-xs px-1 py-0 ${theme.badge}`}>
                  {devMode}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {isAdminContext && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleMinimal}
                  className="h-5 w-5 p-0 hover:bg-gray-200"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleCollapse}
                className="h-5 w-5 p-0 hover:bg-gray-200"
              >
                {collapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            </div>
          </CardHeader>
          
          {!collapsed && (
            <CardContent className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {userTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isActive = devMode === option.type;
                  
                  return (
                    <Button
                      key={option.type}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchToUserType(option.type)}
                      className={`
                        h-8 text-xs justify-start transition-all duration-200
                        ${isActive ? 'shadow-md' : option.color}
                        ${isAdminContext ? 'border-gray-300' : 'border-orange-300'}
                        hover:scale-105 hover:shadow-md
                      `}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {isAdminContext && minimalMode ? option.type.charAt(0).toUpperCase() : option.label}
                    </Button>
                  );
                })}
              </div>
              
              {isDevModeActive && (
                <>
                  <Separator className={isAdminContext ? 'bg-gray-300' : 'bg-orange-300'} />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exitDevMode}
                      className={`
                        flex-1 h-7 text-xs transition-all duration-200
                        ${isAdminContext ? 'border-gray-300 hover:bg-gray-50' : 'border-orange-300 hover:bg-orange-50'}
                        hover:scale-105
                      `}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Exit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetPosition}
                      className={`
                        h-7 px-2 transition-all duration-200
                        ${isAdminContext ? 'border-gray-300 hover:bg-gray-50' : 'border-orange-300 hover:bg-orange-50'}
                        hover:scale-105
                      `}
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
              
              {isAdminContext && (
                <div className="text-xs text-gray-500 text-center">
                  Admin Mode Active
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </Draggable>
  );

  return createPortal(renderComponent(), portalRoot.current);
};

export default DevRoleSwitcher;
