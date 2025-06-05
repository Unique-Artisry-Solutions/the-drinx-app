
import React from 'react';
import { Card } from '@/components/ui/card';
import UserAuthHeader from './UserAuthHeader';
import UserAuthTabs from './UserAuthTabs';
import { UserAuthProps } from './types';
import { BaseComponentProps } from '@/components/shared/types';
import { useCompatibleAuth } from '@/services/compatibility/AuthCompatibilityWrapper';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

// Enhanced version of UserAuth with migration capabilities
interface EnhancedUserAuthProps extends UserAuthProps, BaseComponentProps {
  useEnhancedPattern?: boolean;
  showMigrationInfo?: boolean;
}

const EnhancedUserAuth: React.FC<EnhancedUserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual',
  className,
  useEnhancedPattern = false,
  showMigrationInfo = false,
  'data-testid': testId
}) => {
  const compatibleAuth = useCompatibleAuth();
  const enhancedAuth = useEnhancedAuth({ 
    enableLogging: true, 
    enableTypeValidation: true,
    enableMigrationTracking: true 
  });

  const currentAuth = useEnhancedPattern ? enhancedAuth : compatibleAuth;

  return (
    <div className="space-y-4">
      {showMigrationInfo && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Enhanced Auth Pattern</span>
          </div>
          <p className="text-sm text-blue-700 mb-2">
            This component is using {useEnhancedPattern ? 'Enhanced' : 'Compatible'} auth patterns
          </p>
          <div className="flex gap-2">
            <Badge variant={useEnhancedPattern ? "default" : "secondary"}>
              Enhanced: {useEnhancedPattern ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">
              Type Safety: {enhancedAuth.safeIsAuthenticated ? 'Enabled' : 'Basic'}
            </Badge>
          </div>
        </Card>
      )}
      
      <Card 
        className={`w-full max-w-md mx-auto ${className || ''}`}
        data-testid={testId}
      >
        <UserAuthHeader defaultTab={defaultTab} userType={userType} />
        <UserAuthTabs 
          onSuccess={onSuccess}
          onClose={onClose}
          defaultTab={defaultTab}
          userType={userType}
        />
        
        {showMigrationInfo && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600">
              Auth Status: {currentAuth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'} | 
              User Type: {currentAuth.userType} | 
              Loading: {currentAuth.isLoading ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnhancedUserAuth;
