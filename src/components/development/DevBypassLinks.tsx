import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Megaphone, Shield, User, LogOut } from 'lucide-react';
import { useDevAutoLogin } from '@/hooks/useDevAutoLogin';

const DevBypassLinks: React.FC = () => {
  const { 
    isDevelopmentMode, 
    currentUserType, 
    isAutoLoginActive, 
    switchUserType, 
    logout 
  } = useDevAutoLogin();

  console.log('DevBypassLinks render, isDevelopmentMode:', isDevelopmentMode);

  if (!isDevelopmentMode) return null;

  const bypassOptions = [
    {
      type: 'individual' as const,
      label: 'Individual View',
      icon: User,
      color: 'text-spiritless-pink hover:bg-spiritless-pink/10'
    },
    {
      type: 'establishment' as const,
      label: 'Business View',
      icon: Store,
      color: 'text-spiritless-green hover:bg-spiritless-green/10'
    },
    {
      type: 'promoter' as const,
      label: 'Promoter View',
      icon: Megaphone,
      color: 'text-purple-600 hover:bg-purple-100'
    },
    {
      type: 'admin' as const,
      label: 'Admin View',
      icon: Shield,
      color: 'text-gray-800 hover:bg-gray-100'
    }
  ];

  const handleSwitchUser = async (userType: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    console.log('DevBypassLinks - Switching to user type:', userType);
    await switchUserType(userType);
  };

  const handleLogout = async () => {
    console.log('DevBypassLinks - Logging out');
    await logout();
  };

  return (
    <Card className="mt-8 border-2 border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
          🛠️ Development Auto-Login
        </CardTitle>
        <CardDescription className="text-sm text-orange-700">
          Switch between test user accounts with real authentication
        </CardDescription>
        {isAutoLoginActive && currentUserType && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Currently logged in as: {currentUserType}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isAutoLoginActive && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start border-2 text-red-600 hover:bg-red-50 font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout from Test Account
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {bypassOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              size="sm"
              onClick={() => handleSwitchUser(option.type)}
              className={`justify-start border-2 ${option.color} font-medium ${
                currentUserType === option.type ? 'ring-2 ring-orange-400' : ''
              }`}
              disabled={currentUserType === option.type}
            >
              {React.createElement(option.icon, { className: "h-4 w-4 mr-2" })}
              {option.label}
              {currentUserType === option.type && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
          <strong>How it works:</strong> These buttons log you in as test users with real Supabase authentication and navigate to the appropriate dashboard.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevBypassLinks;
