
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Megaphone, Shield, User } from 'lucide-react';
import { useDevelopmentMode, DevUserType } from '@/contexts/DevelopmentModeContext';

const DevRoleSwitcher: React.FC = () => {
  const { isDevelopment, switchToUserType, devMode } = useDevelopmentMode();
  const navigate = useNavigate();

  if (!isDevelopment) return null;

  const roles = [
    { type: 'individual' as DevUserType, label: 'Individual', icon: User, path: '/explore' },
    { type: 'establishment' as DevUserType, label: 'Business', icon: Store, path: '/establishment/dashboard' },
    { type: 'promoter' as DevUserType, label: 'Promoter', icon: Megaphone, path: '/promoter/dashboard' },
    { type: 'admin' as DevUserType, label: 'Admin', icon: Shield, path: '/admin/system-breakdown' }
  ];

  const handleRoleSwitch = (userType: DevUserType, path: string) => {
    switchToUserType(userType);
    // Manual navigation after dev mode switch
    setTimeout(() => navigate(path), 100);
  };

  return (
    <Card className="w-64 border-orange-300 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-orange-800">Dev Mode</CardTitle>
        <CardDescription className="text-xs text-orange-700">
          Current: {devMode || 'None'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {roles.map((role) => (
          <Button
            key={role.type}
            variant={devMode === role.type ? "default" : "outline"}
            size="sm"
            onClick={() => handleRoleSwitch(role.type, role.path)}
            className="w-full justify-start text-xs"
          >
            <role.icon className="w-3 h-3 mr-2" />
            {role.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default DevRoleSwitcher;
