
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Settings, User, Store, Megaphone, Shield, Move, Bug, TestTube, ExternalLink, UserX, ArrowLeft } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useImpersonationState } from '@/hooks/useImpersonationState';
import { restoreImpersonation } from '@/utils/impersonation';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const DevRoleSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDevelopment, devMode, switchToUserType, exitDevMode, isDevModeActive } = useDevelopmentMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-right');
  const { toast } = useToast();
  
  // Auth testing data
    const { user, isAuthenticated, isLoading } = useAuth();
  
  const { 
    isAuthenticated: devIsAuthenticated, 
    userType: devUserType 
  } = useAuthenticatedUser();

  // Impersonation state
  const { isImpersonating, currentUser, adminUserId, isLoading: impersonationLoading } = useImpersonationState();

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

  const handleEndImpersonation = async () => {
    try {
      toast({
        title: "Ending impersonation...",
        description: "Returning to admin account",
      });
      await restoreImpersonation();
    } catch (error) {
      console.error('Failed to end impersonation:', error);
      toast({
        title: "Failed to end impersonation",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
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
              <TabsList className="grid w-full grid-cols-4 bg-orange-100">
                <TabsTrigger value="roles" className="text-xs">Roles</TabsTrigger>
                <TabsTrigger value="auth" className="text-xs">Auth</TabsTrigger>
                <TabsTrigger value="impersonation" className="text-xs">Imperson</TabsTrigger>
                <TabsTrigger value="testing" className="text-xs">Testing</TabsTrigger>
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
                      <div>{!isLoading ? '✅' : '❌'}</div>
                      
                      <div>Has User:</div>
                      <div>{user ? '✅' : '❌'}</div>
                      
                      <div>Has Session:</div>
                      <div>{user ? '✅' : '❌'}</div>
                      
                      <div>Auth User Type:</div>
                      <div className="truncate">{devUserType || 'none'}</div>
                      
                      <div>Dev User Type:</div>
                      <div className="truncate">{devUserType || 'none'}</div>
                      
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
              
              <TabsContent value="impersonation" className="mt-3">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-orange-800 flex items-center gap-1">
                    <UserX className="h-3 w-3" />
                    Impersonation Control
                  </div>
                  
                  {impersonationLoading ? (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <div className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading impersonation state...
                    </div>
                  ) : isImpersonating ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <UserX className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Currently Impersonating</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="text-red-700">Target User:</div>
                          <div className="font-mono text-red-800 truncate">
                            {currentUser?.email || 'Unknown'}
                          </div>
                          <div className="text-red-700">Target ID:</div>
                          <div className="font-mono text-red-800 truncate">
                            {currentUser?.id?.slice(0, 8) || 'Unknown'}...
                          </div>
                          <div className="text-red-700">Admin ID:</div>
                          <div className="font-mono text-red-800 truncate">
                            {adminUserId?.slice(0, 8) || 'Unknown'}...
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEndImpersonation}
                        className="w-full text-xs border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        End Impersonation
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Normal Session</span>
                      </div>
                      <p className="text-xs text-green-700">
                        Not currently impersonating. Use admin panel to start impersonation.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="testing" className="mt-3">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-orange-800 flex items-center gap-1">
                    <TestTube className="h-3 w-3" />
                    Testing Suite
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <TestTube className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800 text-sm">MVP Testing Suite</p>
                      <p className="text-xs text-blue-600">Comprehensive testing environment</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate('/testing')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
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
