import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Megaphone, Shield, User, LogOut, Zap } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import type { TestUserType } from '@/contexts/DevelopmentModeContext';
import { debugDevBypassState } from '@/utils/devBypassDebug';

interface DevBypassProps {
  variant?: 'full' | 'compact' | 'inline';
  showOnlyUserTypes?: TestUserType[];
  showLogoutButton?: boolean;
  className?: string;
}

const DevBypass: React.FC<DevBypassProps> = ({
  variant = 'full',
  showOnlyUserTypes,
  showLogoutButton = true,
  className = ''
}) => {
  const { 
    isDevelopment, 
    devMode, 
    isDevModeActive, 
    switchToUserType, 
    exitDevMode,
    availableUserTypes,
    isLoading
  } = useDevelopmentMode();

  const filteredUserTypes = showOnlyUserTypes 
    ? availableUserTypes.filter(userType => showOnlyUserTypes.includes(userType.type))
    : availableUserTypes;

  // Debug logging and state inspection
  console.log('🔧 DevBypass Component - Render state:', {
    isDevelopment,
    devMode,
    isDevModeActive,
    isLoading,
    variant,
    availableUserTypes: availableUserTypes.length,
    showOnlyUserTypes,
    filteredUserTypes: filteredUserTypes?.length
  });

  // Run comprehensive debug check
  React.useEffect(() => {
    if (isDevelopment && variant === 'full') {
      debugDevBypassState();
    }
  }, [isDevelopment, variant]);

  if (!isDevelopment) {
    console.log('🔧 DevBypass Component - Not in development mode, hiding');
    return null;
  }

  const getUserTypeIcon = (type: TestUserType) => {
    switch (type) {
      case 'individual':
        return User;
      case 'establishment':
        return Store;
      case 'promoter':
        return Megaphone;
      case 'admin':
        return Shield;
      default:
        return User;
    }
  };

  const getUserTypeColor = (type: TestUserType) => {
    switch (type) {
      case 'individual':
        return 'text-spiritless-pink hover:bg-spiritless-pink/10';
      case 'establishment':
        return 'text-spiritless-green hover:bg-spiritless-green/10';
      case 'promoter':
        return 'text-purple-600 hover:bg-purple-100';
      case 'admin':
        return 'text-gray-800 hover:bg-gray-100';
      default:
        return 'text-gray-600 hover:bg-gray-100';
    }
  };

  const handleSwitchUser = async (userType: TestUserType) => {
    console.log(`🔧 DevBypass Component - Button clicked for ${userType}`);
    
    // Session stability check before switching
    try {
      const { validateSessionState } = await import('@/utils/session/validation');
      const sessionCheck = await validateSessionState();
      
      if (!sessionCheck.isValid && sessionCheck.errorDetails) {
        console.warn('🔧 DevBypass - Session instability detected before user switch:', sessionCheck);
        
        // Attempt session recovery
        const { recoverFromStuckState } = await import('@/utils/session/recovery');
        await recoverFromStuckState();
        return;
      }
    } catch (sessionError) {
      console.warn('🔧 DevBypass - Session check failed:', sessionError);
      // Continue with user switch despite session check failure
    }
    
    // Add visual feedback for navigation in progress
    if (userType === 'admin') {
      console.log('🔧 DevBypass Component - Admin login starting, expect navigation delay...');
    }
    
    try {
      await switchToUserType(userType);
      
      // Enhanced post-switch validation
      setTimeout(async () => {
        const currentPath = window.location.pathname;
        console.log(`🔧 DevBypass Component - Post-switch navigation check: ${currentPath}`);
        
        // Check if we're still on the login page or in an unexpected state
        if (currentPath === '/login' || currentPath === '/admin/login') {
          console.warn('🔧 DevBypass Component - Navigation may have failed, attempting recovery');
          
          // Import session recovery
          try {
            const { handlePotentialStuckState } = await import('@/utils/session/recovery');
            handlePotentialStuckState(3000, true); // Auto-recovery enabled
          } catch (recoveryError) {
            console.error('🔧 DevBypass - Recovery import failed:', recoveryError);
            window.location.reload(); // Fallback refresh
          }
        }
      }, 1500);
    } catch (error) {
      console.error(`🔧 DevBypass Component - Error switching to ${userType}:`, error);
      
      // Enhanced error handling with session recovery
      const errorMessage = `❌ Failed to switch to ${userType}: ${error}`;
      console.error(errorMessage);
      
      // Attempt automatic recovery for session-related errors
      const errorString = String(error).toLowerCase();
      if (errorString.includes('session') || errorString.includes('auth') || errorString.includes('token')) {
        try {
          const { recoverFromStuckState } = await import('@/utils/session/recovery');
          await recoverFromStuckState();
        } catch (recoveryError) {
          console.error('🔧 DevBypass - Recovery failed:', recoveryError);
          alert(errorMessage + '\n\nPlease refresh the page and try again.');
        }
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleLogout = async () => {
    console.log('🔧 DevBypass Component - Logout button clicked');
    try {
      await exitDevMode();
    } catch (error) {
      console.error('🔧 DevBypass Component - Error logging out:', error);
      alert(`❌ Failed to logout: ${error}`);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {filteredUserTypes.map((userType) => {
          const IconComponent = getUserTypeIcon(userType.type);
          return (
            <Button
              key={userType.type}
              variant="outline"
              size="sm"
              onClick={() => handleSwitchUser(userType.type)}
                className={`text-xs ${getUserTypeColor(userType.type)} ${
                  devMode === userType.type ? 'ring-2 ring-orange-400 bg-orange-100' : ''
                }`}
                disabled={isLoading}
                title={devMode === userType.type ? `Currently logged in as ${userType.type}` : `Switch to ${userType.type}`}
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {userType.type}
              {devMode === userType.type && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  Active
                </Badge>
              )}
            </Button>
          );
        })}
        {showLogoutButton && isDevModeActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-red-600 hover:bg-red-50"
            disabled={isLoading}
          >
            <LogOut className="h-3 w-3 mr-1" />
            Logout
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={`border-orange-300 bg-orange-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Dev Mode</span>
            </div>
            {isDevModeActive && devMode && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                {devMode}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {filteredUserTypes.map((userType) => {
              const IconComponent = getUserTypeIcon(userType.type);
              return (
                <Button
                  key={userType.type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwitchUser(userType.type)}
                  className={`justify-start text-xs ${getUserTypeColor(userType.type)} ${
                    devMode === userType.type ? 'ring-2 ring-orange-400 bg-orange-100' : ''
                  }`}
                  disabled={isLoading}
                  title={devMode === userType.type ? `Currently logged in as ${userType.type}` : `Switch to ${userType.type}`}
                >
                  <IconComponent className="h-3 w-3 mr-2" />
                  {userType.label}
                </Button>
              );
            })}
          </div>

          {showLogoutButton && isDevModeActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-2 text-xs text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              <LogOut className="h-3 w-3 mr-2" />
              Logout
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full variant (default)
  return (
    <Card className={`border-2 border-orange-300 bg-orange-50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
          🛠️ Development Auto-Login
        </CardTitle>
        <CardDescription className="text-sm text-orange-700">
          Switch between test user accounts with real authentication
        </CardDescription>
        {isDevModeActive && devMode && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Currently logged in as: {devMode}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {showLogoutButton && isDevModeActive && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start border-2 text-red-600 hover:bg-red-50 font-medium"
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout from Test Account
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {filteredUserTypes.map((userType) => {
            const IconComponent = getUserTypeIcon(userType.type);
            return (
              <Button
                key={userType.type}
                variant="outline"
                size="sm"
                onClick={() => handleSwitchUser(userType.type)}
                className={`justify-start border-2 ${getUserTypeColor(userType.type)} font-medium ${
                  devMode === userType.type ? 'ring-2 ring-orange-400 bg-orange-100' : ''
                }`}
                disabled={isLoading}
                title={devMode === userType.type ? `Currently logged in as ${userType.type}` : `Switch to ${userType.type}`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {userType.label}
                {devMode === userType.type && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Active
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
          <strong>How it works:</strong> These buttons log you in as test users with real Supabase authentication and navigate to the appropriate dashboard.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevBypass;