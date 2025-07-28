
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Settings, User, Store, Megaphone, Shield, Move, Bug } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useDevAuthBypass } from '@/hooks/useDevAuthBypass';
import { useLocation, useNavigate } from 'react-router-dom';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const DevRoleSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-right');
  
  // Auth testing data
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

  if (!isDevelopment) return null;

  const roleOptions = [
    { type: 'individual' as const, label: 'Individual', icon: User, color: 'bg-blue-500' },
    { type: 'establishment' as const, label: 'Establishment', icon: Store, color: 'bg-green-500' },
    { type: 'promoter' as const, label: 'Promoter', icon: Megaphone, color: 'bg-purple-500' },
    { type: 'admin' as const, label: 'Admin', icon: Shield, color: 'bg-red-500' }
  ];

  const testRoutes = [
    { path: '/', label: 'Index' },
    { path: '/landing', label: 'Landing' },
    { path: '/explore', label: 'Explore' },
    { path: '/login', label: 'Login' },
    { path: '/admin/system-breakdown', label: 'Admin Dashboard' }
  ];

  const currentRole = roleOptions.find(role => role.type === devMode);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const cyclePosition = () => {
    const positions: Position[] = ['bottom-right', 'top-right', 'top-left', 'bottom-left'];
    const currentIndex = positions.indexOf(position);
    const nextIndex = (currentIndex + 1) % positions.length;
    setPosition(positions[nextIndex]);
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] max-w-sm`}>
      {/* Collapsed Header */}
      <div 
        className="shadow-lg border-2 border-orange-400 bg-orange-50 p-2 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Dev Tools</span>
            {isDevModeActive && currentRole && (
              <Badge variant="secondary" className="text-xs">
                {React.createElement(currentRole.icon, { className: "h-3 w-3 mr-1" })}
                {currentRole.label}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                cyclePosition();
              }}
              className="p-1 h-auto hover:bg-orange-200"
              title="Change position"
            >
              <Move className="h-3 w-3 text-orange-600" />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-orange-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-orange-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <Card className="mt-2 border-2 border-orange-300 bg-orange-50 max-w-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-orange-800 flex items-center gap-2">
              🛠️ Development Tools
            </CardTitle>
            <div className="text-sm text-orange-700">
              <div>Mode: {isDevModeActive ? 'Active' : 'Inactive'}</div>
              {devMode && <div>Role: {devMode}</div>}
              <div className="text-xs text-orange-600 mt-1">Position: {position}</div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs defaultValue="roles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-orange-100">
                <TabsTrigger value="roles" className="text-xs">Roles</TabsTrigger>
                <TabsTrigger value="auth" className="text-xs">Auth & Routes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roles" className="mt-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-orange-800 mb-2">Switch User Type:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((option) => (
                      <Button
                        key={option.type}
                        variant={devMode === option.type ? "default" : "outline"}
                        size="sm"
                        onClick={() => switchToUserType(option.type)}
                        className={`justify-start text-xs ${
                          devMode === option.type 
                            ? `${option.color} text-white hover:${option.color}/90` 
                            : 'hover:bg-orange-100'
                        }`}
                      >
                        {React.createElement(option.icon, { className: "h-3 w-3 mr-1" })}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  {isDevModeActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exitDevMode}
                      className="w-full mt-2 text-xs border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      Exit Dev Mode
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="auth" className="mt-3">
                <div className="space-y-3">
                  {/* Auth Status */}
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-orange-800 flex items-center gap-1">
                      <Bug className="h-3 w-3" />
                      Auth Status
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>Current Path:</div>
                      <div className="font-mono text-xs truncate">{location.pathname}</div>
                      
                      <div>Is Loading:</div>
                      <div>{isLoading ? '✅' : '❌'}</div>
                      
                      <div>Auth Stable:</div>
                      <div>{authStable ? '✅' : '❌'}</div>
                      
                      <div>Has User:</div>
                      <div>{user ? '✅' : '❌'}</div>
                      
                      <div>Has Session:</div>
                      <div>{session ? '✅' : '❌'}</div>
                      
                      <div>Auth User Type:</div>
                      <div className="truncate">{authUserType || 'none'}</div>
                      
                      <div>Dev User Type:</div>
                      <div className="truncate">{devUserType || 'none'}</div>
                      
                      <div>Using Dev Bypass:</div>
                      <div>{isUsingDevBypass ? '✅' : '❌'}</div>
                      
                      <div>Dev Authenticated:</div>
                      <div>{devIsAuthenticated ? '✅' : '❌'}</div>
                    </div>
                  </div>
                  
                  {/* Test Routes */}
                  <div className="border-t pt-2">
                    <div className="text-sm font-medium text-orange-800 mb-2">Test Routes:</div>
                    <div className="grid grid-cols-2 gap-1">
                      {testRoutes.map(route => (
                        <Button
                          key={route.path}
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 hover:bg-orange-100"
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DevRoleSwitcher;
