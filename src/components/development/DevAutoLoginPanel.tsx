import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Megaphone, Shield, User, LogOut } from 'lucide-react';
import { useDevAutoLogin } from '@/hooks/useDevAutoLogin';
import { TestUserType } from '@/services/DevAutoLoginService';

const DevAutoLoginPanel: React.FC = () => {
  const {
    isDevelopmentMode,
    currentUserType,
    isAutoLoginActive,
    availableUserTypes,
    isLoading,
    switchUserType,
    logout,
  } = useDevAutoLogin();

  if (!isDevelopmentMode) return null;

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

  return (
    <Card className="mt-8 border-2 border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-base text-orange-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            🛠️ Development Auto-Login
          </span>
          {isAutoLoginActive && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active: {currentUserType}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-sm text-orange-700">
          {isAutoLoginActive 
            ? `Currently logged in as ${availableUserTypes.find(u => u.type === currentUserType)?.label}. Switch accounts or logout below.`
            : 'Choose a test account to automatically login with. Uses real Supabase authentication.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {availableUserTypes.map((userType) => {
            const Icon = getUserTypeIcon(userType.type);
            const isActive = currentUserType === userType.type;
            
            return (
              <Button
                key={userType.type}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => switchUserType(userType.type)}
                disabled={isLoading}
                className={`justify-start border-2 ${getUserTypeColor(userType.type)} font-medium ${
                  isActive ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {userType.label}
                {isActive && <Badge className="ml-2 bg-white/20">Active</Badge>}
              </Button>
            );
          })}
        </div>
        
        {isAutoLoginActive && (
          <div className="mt-3 pt-3 border-t border-orange-200">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              disabled={isLoading}
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout from Test Account
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
          <strong>How it works:</strong> These buttons automatically login with real test user accounts. 
          All authentication, database access, and navigation work exactly like production. 
          Switch between accounts to test different user experiences.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevAutoLoginPanel;