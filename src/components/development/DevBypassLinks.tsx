
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Megaphone, Shield, User } from 'lucide-react';
import { useDevelopmentMode } from '@/hooks/useDevelopmentMode';

const DevBypassLinks: React.FC = () => {
  const { isDevelopment, switchToUserType } = useDevelopmentMode();

  console.log('DevBypassLinks render, isDevelopment:', isDevelopment);

  if (!isDevelopment) return null;

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

  const handleBypass = (userType: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    console.log('DevBypassLinks - Switching to user type:', userType);
    switchToUserType(userType);
  };

  return (
    <Card className="mt-8 border-2 border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-base text-orange-800 flex items-center gap-2">
          🛠️ Development Bypass Links
        </CardTitle>
        <CardDescription className="text-sm text-orange-700">
          Click these buttons to bypass authentication and go directly to each interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {bypassOptions.map((option) => (
            <Button
              key={option.type}
              variant="outline"
              size="sm"
              onClick={() => handleBypass(option.type)}
              className={`justify-start border-2 ${option.color} font-medium`}
            >
              {React.createElement(option.icon, { className: "h-4 w-4 mr-2" })}
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-orange-700 bg-orange-100 p-3 rounded border border-orange-300">
          <strong>How it works:</strong> These buttons activate development mode and navigate directly 
          to the appropriate dashboard without requiring authentication.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevBypassLinks;
