
import React from 'react';
import { Card } from '@/components/ui/card';
import UserAuthHeader from './auth/UserAuthHeader';
import UserAuthTabs from './auth/UserAuthTabs';
import { UserAuthProps } from './auth/types';
import { BaseComponentProps } from '@/components/shared/types';

// Extend with standard props
interface StandardUserAuthProps extends UserAuthProps, BaseComponentProps {}

export const UserAuth: React.FC<StandardUserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual',
  className,
  'data-testid': testId
}) => {
  return (
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
    </Card>
  );
};

// Keep default export for backward compatibility during transition
export default UserAuth;
