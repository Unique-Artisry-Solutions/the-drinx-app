
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench, User, Store, Megaphone, Shield, Minimize2, GripVertical, TestTube, Route } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useLocation, useNavigate } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isInitialized } = useDevelopmentMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Auth testing data
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    session, 
    isLoading, 
    authStable, 
    userType: authUserType 
  } = useAuth();
  
  const { 
    isAuthenticated: devIsAuthenticated, 
    userType: devUserType,
    isUsingDevBypass 
  } = useDevAuthBypass();

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
    const elementWidth = isCollapsed ? 60 : 320;
    const elementHeight = isCollapsed ? 60 : 400;
    
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

  const testRoutes = [
    { path: '/', label: 'Index' },
    { path: '/landing', label: 'Landing' },
    { path: '/explore', label: 'Explore' },
    { path: '/login', label: 'Login' },
    { path: '/admin/system-breakdown', label: 'Admin Dashboard' }
  ];

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
          isCollapsed ? 'w-15 h-15' : 'w-80 min-h-96'
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

              <Tabs defaultValue="roles" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="roles" className="text-xs">
                    <User className="w-3 h-3 mr-1" />
                    Roles
                  </TabsTrigger>
                  <TabsTrigger value="testing" className="text-xs">
                    <TestTube className="w-3 h-3 mr-1" />
                    Debug
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="roles" className="space-y-3 mt-3">
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
                </TabsContent>
                
                <TabsContent value="testing" className="space-y-3 mt-3">
                  <div className="text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>Path:</div>
                      <div className="font-mono text-[10px]">{location.pathname}</div>
                      
                      <div>Loading:</div>
                      <div>{isLoading ? '✅' : '❌'}</div>
                      
                      <div>Auth Stable:</div>
                      <div>{authStable ? '✅' : '❌'}</div>
                      
                      <div>Has User:</div>
                      <div>{user ? '✅' : '❌'}</div>
                      
                      <div>Has Session:</div>
                      <div>{session ? '✅' : '❌'}</div>
                      
                      <div>Auth Type:</div>
                      <div className="text-[10px]">{authUserType || 'none'}</div>
                      
                      <div>Dev Type:</div>
                      <div className="text-[10px]">{devUserType || 'none'}</div>
                      
                      <div>Dev Bypass:</div>
                      <div>{isUsingDevBypass ? '✅' : '❌'}</div>
                      
                      <div>Dev Auth:</div>
                      <div>{devIsAuthenticated ? '✅' : '❌'}</div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="text-xs font-medium mb-1 flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        Test Routes:
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {testRoutes.map(route => (
                          <Button
                            key={route.path}
                            size="sm"
                            variant="outline"
                            className="text-[10px] h-6 justify-start"
                            onClick={() => navigate(route.path)}
                          >
                            {route.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </Card>
      </div>
    </Draggable>
  );

  return createPortal(<DevSwitcherContent />, document.body);
};

export default DevRoleSwitcher;
